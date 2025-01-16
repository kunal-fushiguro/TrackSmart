import React from "react";

const ResetPasswordEmail = ({
  firstName,
  resetPasswordUrl,
}: {
  resetPasswordUrl: string;
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
      <h1 style={{ color: "#4CAF50" }}>Reset Your Password, {firstName}</h1>
      <p>
        We received a request to reset your password for your TrackSmart
        account. Click the button below to reset your password:
      </p>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <a
          href={resetPasswordUrl}
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
          Reset Your Password
        </a>
      </div>
      <p>
        If you didn’t request a password reset, you can safely ignore this
        email. Your password will not be changed unless you click the link
        above.
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

export default ResetPasswordEmail;
