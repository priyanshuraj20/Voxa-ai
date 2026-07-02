import resend

from app.core.config import RESEND_API_KEY

resend.api_key = RESEND_API_KEY



def send_reset_otp(

    email,

    otp

):
    try:
        resend.Emails.send(
            {
                "from": "Voxa <onboarding@resend.dev>",
                "to": email,
                "subject": "Reset Your Password",
                "html": f"""
                <h2>Reset Password</h2>
                <p>Your OTP is</p>
                <h1>{otp}</h1>
                <p>Valid for 5 minutes.</p>
                """
            }
        )
        print(f"✉️ Password reset OTP email sent successfully to {email}")
    except Exception as e:
        print(f"\n❌ RESEND EMAIL DELIVERY FAILURE: {e}")
        print(f"🔑 OTP FOR TESTING ({email}): {otp}\n")