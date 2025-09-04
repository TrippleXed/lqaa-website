const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, phone, service, message } = req.body;

        // Basic validation
        if (!name || !email || !service || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, email, service, and message are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Create nodemailer transporter
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        // Email content
        const emailContent = `
New Contact Form Submission from LQAA Website

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service: ${service}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
        `.trim();

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #1a2332; border-bottom: 3px solid #f59e0b; padding-bottom: 10px;">
                New Contact Form Submission
            </h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Service:</strong> ${service}</p>
            </div>
            <div style="margin: 20px 0;">
                <h3 style="color: #374151;">Message:</h3>
                <div style="background: white; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
            <hr style="border: none; height: 1px; background: #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">
                Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
            </p>
        </div>
        `;

        // Send email
        await transporter.sendMail({
            from: `"LQAA Website" <${process.env.GMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL || 'info@lqaa.co.uk',
            subject: `New Contact Form - ${service} - ${name}`,
            text: emailContent,
            html: htmlContent,
            replyTo: email
        });

        // Send confirmation email to user
        await transporter.sendMail({
            from: `"LQAA Ltd" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Thank you for contacting LQAA - We\'ll respond within 2 hours',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <h2 style="color: #1a2332;">Thank you for contacting LQAA</h2>
                <p>Dear ${name},</p>
                <p>Thank you for your enquiry regarding <strong>${service}</strong>. We have received your message and will respond within 2 hours during business hours.</p>
                <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Your enquiry:</strong></p>
                    <p style="margin: 10px 0 0 0; color: #374151;">${message}</p>
                </div>
                <p>If you need immediate assistance, please call us on <strong>0208 123 4690</strong>.</p>
                <hr style="border: none; height: 1px; background: #e5e7eb; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 14px;">
                    LQAA Ltd - London's Premier Licensing Consultancy<br>
                    Westminster Business Centre, Printing House Lane, Hayes, UB3 1AP<br>
                    Phone: 0208 123 4690 | Email: info@lqaa.co.uk
                </p>
            </div>
            `
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Your enquiry has been sent successfully. We\'ll respond within 2 hours and you should receive a confirmation email shortly.' 
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ 
            error: 'Failed to send message. Please try again or contact us directly at info@lqaa.co.uk or 0208 123 4690.' 
        });
    }
}