const sendEmail = require('./sendEmail')

const notifyPatient = async ({ patient, doctor, appointment, status }) => {
  const date = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const time = appointment.timeSlot
  const isOnline = appointment.type === 'online' || appointment.type === 'telemedicine'

  const isConfirmed = status === 'confirmed'
  const emoji = isConfirmed ? '✅' : '❌'
  const word = isConfirmed ? 'Confirmed' : 'Cancelled'
  const color = isConfirmed ? '#10b981' : '#ef4444'

  await sendEmail({
    to: patient.email,
    subject: `${emoji} Appointment ${word} — SynaptoClin`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0a0f1e;color:#fff;padding:32px;border-radius:16px;">
        <h2 style="background:linear-gradient(90deg,#4f8ef7,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;">
          SynaptoClin AI
        </h2>
        <p style="color:rgba(255,255,255,0.6);margin-bottom:24px;">Healthcare Management Platform</p>

        <div style="background:#111827;border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.1);">
          <p style="font-size:18px;font-weight:500;margin-bottom:16px;">
            ${emoji} Appointment <span style="color:${color}">${word}</span>
          </p>
          <p style="color:rgba(255,255,255,0.6);margin-bottom:8px;">
            Hi <strong style="color:#fff">${patient.name}</strong>,
          </p>
          <p style="color:rgba(255,255,255,0.6);margin-bottom:20px;">
            Your appointment has been <strong style="color:${color}">${word.toLowerCase()}</strong>.
          </p>

          <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="margin:0 0 8px;color:rgba(255,255,255,0.4);font-size:12px;">APPOINTMENT DETAILS</p>
            <p style="margin:0 0 6px;color:#fff;">👨‍⚕️ Dr. ${doctor.name}</p>
            <p style="margin:0 0 6px;color:rgba(255,255,255,0.6);">📅 ${date}</p>
            <p style="margin:0 0 6px;color:rgba(255,255,255,0.6);">🕐 ${time}</p>
            <p style="margin:0;color:rgba(255,255,255,0.6);">📍 ${isOnline ? '🎥 Online (Video Call)' : '🏥 In-person'}</p>
          </div>

          ${isConfirmed && isOnline && appointment.meetingUrl ? `
          <div style="background:rgba(79,142,247,0.1);border-radius:8px;padding:16px;margin-bottom:20px;border:1px solid rgba(79,142,247,0.3);">
            <p style="margin:0 0 8px;color:rgba(255,255,255,0.4);font-size:12px;">🎥 VIDEO CALL LINK</p>
            <a href="${appointment.meetingUrl}"
              style="color:#4f8ef7;word-break:break-all;font-size:13px;">
              ${appointment.meetingUrl}
            </a>
            <p style="margin:10px 0 0;color:rgba(255,255,255,0.4);font-size:12px;">
              Click the link at your appointment time to join the call. No downloads required.
            </p>
          </div>
          ` : ''}

          ${isConfirmed
            ? `<p style="color:rgba(255,255,255,0.5);font-size:13px;">
                ${isOnline
                  ? 'Use the video call link above at your appointment time. Make sure your camera and microphone are working.'
                  : 'Please arrive 10 minutes early. Bring any relevant medical records.'
                }
               </p>`
            : `<p style="color:rgba(255,255,255,0.5);font-size:13px;">
                You can book a new appointment anytime from your dashboard.
               </p>`
          }
        </div>

        <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:24px;text-align:center;">
          SynaptoClin AI — AI-Powered Healthcare
        </p>
      </div>
    `
  })
}

module.exports = notifyPatient