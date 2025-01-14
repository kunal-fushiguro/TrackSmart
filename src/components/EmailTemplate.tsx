const EmailTemplate = ({
  firstName,
  confirmationUrl,
}: {
  confirmationUrl: string;
  firstName: string;
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333",
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "20px auto",
      }}
    >
      <h1 style={{ color: "#4CAF50" }}>Welcome to TrackSmart, {firstName}!</h1>
      <p>
        We're thrilled to have you as part of the TrackSmart community! To
        complete your sign-up, please confirm your email address by clicking the
        button below:
      </p>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <a
          href={confirmationUrl}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "#4CAF50",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Confirm Your Email
        </a>
      </div>
      <p>
        If you didn’t sign up for TrackSmart, you can safely ignore this email.
      </p>
      <p>Thank you for choosing TrackSmart!</p>
      <p>Best regards,</p>
      <p>
        <strong>The TrackSmart Team</strong>
      </p>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ddd",
          margin: "20px 0",
        }}
      />
      <p style={{ fontSize: "12px", color: "#777" }}>
        If you have any questions, please contact us at{" "}
        <a href="mailto:support@tracksmart.com" style={{ color: "#4CAF50" }}>
          support@tracksmart.com
        </a>
        .
      </p>
    </div>
  );
};

export default EmailTemplate;
