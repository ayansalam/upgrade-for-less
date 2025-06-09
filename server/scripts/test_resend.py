import resend

resend.api_key = "re_ZPujt7KB_HA9UviqfFHvsiYan8fgrun3V"

try:
    response = resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": "mohammadayan5442@gmail.com",
        "subject": "Hello World",
        "html": "<p>Congrats on sending your <strong>first email</strong>!</p>"
    })
    print("✅ Email sent successfully!")
    print("Response:", response)
except Exception as e:
    print("❌ Error sending email:")
    print(e) 