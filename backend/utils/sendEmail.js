const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const HOTEL  = () => process.env.HOTEL_NAME  || 'Isinmi Hotel';
const GREEN  = '#1a3528';
const GOLD   = '#c9a86c';
const CREAM  = '#f5f0e8';
const MUTED  = '#6b7280';
const WHITE  = '#ffffff';

/* ─── Shared layout helpers ──────────────────────────────────────── */

const emailWrapper = (bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${HOTEL()}</title>
</head>
<body style="margin:0; padding:0; background-color:${CREAM}; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${CREAM};">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
               style="max-width:600px; width:100%; background-color:${WHITE}; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          ${bodyHtml}

          <!-- Footer -->
          <tr>
            <td style="background-color:${GREEN}; padding: 28px 40px; text-align:center;">
              <p style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:18px; font-weight:500; color:${WHITE}; letter-spacing:0.5px;">
                ${HOTEL()}
              </p>
              <p style="margin:8px 0 0; font-size:12px; color:rgba(255,255,255,0.5); letter-spacing:1px; text-transform:uppercase;">
                Luxury Stays &middot; Exceptional Service
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:20px 0 0; font-size:11px; color:${MUTED}; text-align:center;">
          &copy; ${new Date().getFullYear()} ${HOTEL()}. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

/* Renders one booking detail row */
const detailRow = (label, value, shade) => `
<tr>
  <td style="padding:14px 24px; background-color:${shade ? '#faf8f5' : WHITE}; border-bottom:1px solid #ede9e3; width:40%;">
    <span style="font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:${MUTED};">${label}</span>
  </td>
  <td style="padding:14px 24px; background-color:${shade ? '#faf8f5' : WHITE}; border-bottom:1px solid #ede9e3;">
    <span style="font-size:14px; font-weight:600; color:${GREEN};">${value}</span>
  </td>
</tr>`;

/* ─── Email 1: Booking Request Received ──────────────────────────── */

const sendBookingConfirmationEmail = async ({ guestName, guestEmail, booking, assignedRoom, category, daysOfStay }) => {
    const confirmUrl = `${process.env.FRONTEND_URL}/booking/confirm/${booking._id}`;
    const checkIn  = new Date(booking.checkInDate).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const total    = (assignedRoom.pricePerNight * daysOfStay).toLocaleString();
    const price    = assignedRoom.pricePerNight?.toLocaleString();

    const body = `
          <!-- Header -->
          <tr>
            <td style="background-color:${GREEN}; padding:40px 40px 32px; text-align:center;">
              <p style="margin:0 0 6px; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:${GOLD};">
                BOOKING REQUEST
              </p>
              <h1 style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:32px; font-weight:400; color:${WHITE}; line-height:1.2;">
                We've Got Your Request
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:36px 40px 24px;">
              <p style="margin:0 0 12px; font-size:16px; color:#1a1a1a;">
                Hello, <strong>${guestName}</strong> 👋
              </p>
              <p style="margin:0; font-size:14px; color:${MUTED}; line-height:1.75;">
                Thank you for choosing ${HOTEL()}. Your booking request has been received
                and is currently being reviewed. We'll send you a confirmation as soon as it's approved.
              </p>
            </td>
          </tr>

          <!-- Section label -->
          <tr>
            <td style="padding:0 40px 12px;">
              <p style="margin:0; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${GOLD};">
                RESERVATION SUMMARY
              </p>
              <div style="height:2px; background:linear-gradient(90deg, ${GOLD}, transparent); margin-top:6px; border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Details card -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="border-radius:8px; overflow:hidden; border:1px solid #ede9e3;">
                ${detailRow('Room Type',   category,                           false)}
                ${detailRow('Check-in',    checkIn,                            true)}
                ${detailRow('Check-out',   checkOut,                           false)}
                ${detailRow('Duration',    `${daysOfStay} night${daysOfStay !== 1 ? 's' : ''}`, true)}
                ${detailRow('Rate',        `&#8358;${price} / night`,          false)}
                <tr>
                  <td style="padding:16px 24px; background-color:${GREEN}; width:40%;">
                    <span style="font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:rgba(255,255,255,0.6);">Total</span>
                  </td>
                  <td style="padding:16px 24px; background-color:${GREEN};">
                    <span style="font-family:Georgia,serif; font-size:22px; font-weight:400; color:${WHITE};">&#8358;${total}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirm CTA -->
          <tr>
            <td style="padding:0 40px 12px; text-align:center;">
              <p style="margin:0 0 20px; font-size:14px; color:${MUTED}; line-height:1.75;">
                To secure your room, please confirm your booking by clicking the button below.
                This link will expire in <strong style="color:#1a1a1a;">24 hours</strong>.
              </p>
              <a href="${confirmUrl}"
                 style="display:inline-block; padding:16px 40px; background-color:${GREEN};
                        color:${WHITE}; text-decoration:none; border-radius:6px;
                        font-family:Arial,sans-serif; font-size:15px; font-weight:700;
                        letter-spacing:0.5px;">
                Confirm My Booking &rarr;
              </a>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="padding:28px 40px 0;">
              <div style="height:1px; background:linear-gradient(90deg, transparent, ${GOLD}, transparent);"></div>
            </td>
          </tr>

          <!-- Note -->
          <tr>
            <td style="padding:20px 40px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#f5f0e8; border-radius:8px; border-left:3px solid ${GOLD};">
                <tr>
                  <td style="padding:18px 22px;">
                    <p style="margin:0 0 6px; font-family:Georgia,serif; font-size:16px; font-weight:400; color:${GREEN};">
                      Why do I need to confirm?
                    </p>
                    <p style="margin:0; font-size:13px; color:${MUTED}; line-height:1.8;">
                      Confirming your booking lets us know you're still interested so we can
                      hold a room for you. Once confirmed, you'll receive a second email with
                      your final room details.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0; font-size:12px; color:${MUTED}; line-height:1.7;">
                If you did not make this booking, please disregard this email — no action is needed.
                For questions, contact us at
                <a href="mailto:${process.env.EMAIL_USER}" style="color:${GREEN}; font-weight:600;">${process.env.EMAIL_USER}</a>.
              </p>
            </td>
          </tr>`;

    await transporter.sendMail({
        from:    `"${HOTEL()}" <${process.env.EMAIL_USER}>`,
        to:      guestEmail,
        subject: `Booking Request Received – ${HOTEL()}`,
        html:    emailWrapper(body),
    });
};

/* ─── Email 2: Booking Confirmed ─────────────────────────────────── */

const sendBookingConfirmedEmail = async ({ guestName, guestEmail, booking, roomName }) => {
    const checkIn  = new Date(booking.checkInDate).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const nights   = booking.daysOfStay;
    const price    = booking.pricePerNight?.toLocaleString();
    const total    = booking.totalPrice?.toLocaleString();

    const body = `
          <!-- Header with badge -->
          <tr>
            <td style="background-color:${GREEN}; padding:40px 40px 32px; text-align:center;">
              <!-- Checkmark circle -->
              <div style="display:inline-block; width:56px; height:56px; border-radius:50%; background-color:rgba(201,168,108,0.2); border:2px solid ${GOLD}; margin-bottom:16px; line-height:56px; font-size:26px;">
                ✓
              </div>
              <p style="margin:0 0 6px; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:${GOLD};">
                RESERVATION CONFIRMED
              </p>
              <h1 style="margin:0; font-family:Georgia,'Times New Roman',serif; font-size:32px; font-weight:400; color:${WHITE}; line-height:1.2;">
                See You Soon, ${guestName}!
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:36px 40px 24px;">
              <p style="margin:0; font-size:14px; color:${MUTED}; line-height:1.75;">
                Wonderful news — your reservation at <strong style="color:#1a1a1a;">${HOTEL()}</strong> has been
                <strong style="color:${GREEN};">officially confirmed</strong>. We can't wait to welcome you.
                Here are your full booking details for reference.
              </p>
            </td>
          </tr>

          <!-- Section label -->
          <tr>
            <td style="padding:0 40px 12px;">
              <p style="margin:0; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${GOLD};">
                YOUR BOOKING DETAILS
              </p>
              <div style="height:2px; background:linear-gradient(90deg, ${GOLD}, transparent); margin-top:6px; border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Details card -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="border-radius:8px; overflow:hidden; border:1px solid #ede9e3;">
                ${detailRow('Room',        roomName,                                 false)}
                ${detailRow('Check-in',    checkIn,                                  true)}
                ${detailRow('Check-out',   checkOut,                                 false)}
                ${detailRow('Duration',    `${nights} night${nights !== 1 ? 's' : ''}`, true)}
                ${detailRow('Rate',        `&#8358;${price} / night`,                false)}
                <tr>
                  <td style="padding:16px 24px; background-color:${GREEN}; width:40%;">
                    <span style="font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:rgba(255,255,255,0.6);">Total</span>
                  </td>
                  <td style="padding:16px 24px; background-color:${GREEN};">
                    <span style="font-family:Georgia,serif; font-size:22px; font-weight:400; color:${WHITE};">&#8358;${total}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Warm message -->
          <tr>
            <td style="padding:0 40px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="background-color:#f5f0e8; border-radius:8px; border-left:3px solid ${GOLD};">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px; font-family:Georgia,serif; font-size:17px; font-weight:400; color:${GREEN};">
                      We're delighted to have you.
                    </p>
                    <p style="margin:0; font-size:13px; color:${MUTED}; line-height:1.8;">
                      If you have any special requests or need assistance before your arrival,
                      don't hesitate to reach out. We'll do everything to make your stay exceptional.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0; font-size:12px; color:${MUTED}; line-height:1.7;">
                Questions? Contact us at
                <a href="mailto:${process.env.EMAIL_USER}" style="color:${GREEN}; font-weight:600;">${process.env.EMAIL_USER}</a>.
                We're here 24/7.
              </p>
            </td>
          </tr>`;

    await transporter.sendMail({
        from:    `"${HOTEL()}" <${process.env.EMAIL_USER}>`,
        to:      guestEmail,
        subject: `Your Stay is Confirmed — ${HOTEL()}`,
        html:    emailWrapper(body),
    });
};

module.exports = { sendBookingConfirmationEmail, sendBookingConfirmedEmail };
