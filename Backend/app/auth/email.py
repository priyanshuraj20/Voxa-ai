import resend

from app.core.config import RESEND_API_KEY

resend.api_key = RESEND_API_KEY



def send_reset_otp(

    email,

    otp

):

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