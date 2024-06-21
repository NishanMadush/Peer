export const textTemplate = `Hi,
To reset your password, click on this link: http://<%= frontUrl %>/reset-password?token=<%= token %>
If you did not request any password resets, then ignore this email.`;
export const htmlTemplate = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;">
  <h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: http://<%= frontUrl %>/reset-password?token=<%= token %></p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p>
</div>`;
//# sourceMappingURL=emailResetPassword.js.map