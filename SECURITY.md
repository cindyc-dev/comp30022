# Security Policy

## Authentication and Authorization:
- **Authentication Mechanism:**
  - User authentication is handled using email and password with JWT.
  - GitHub, Google, and Discord are also allowed as third-party authentication providers.
- **Authorization:**
  - Only one role exists: "user."
  - Access controls are role-based.
## Data Protection:
- **Sensitive Information:**
  - Handles personal names, emails, and contact phone numbers.
- **Encryption:**
  - Passwords are encrypted using `bcrypt` and salted before storage.
## Third-Party Libraries and Dependencies:
- **Dependencies:**
  - External libraries are listed in the `package.json` file.
  - Regularly use `npm audit` to check for vulnerabilities.
- **Security Assessment:**
  - No formal process in place. Consider integrating automated dependency scanning tools.
## Code Review and Deployment:
- **Code Review:**
  - Code must be reviewed by at least one other developer before merging into the main branch.
- **Deployment Security:**
  - Only developers can access the deployment pipeline.
## Logging and Monitoring:
- Provided by Vercel upon deployment.
## Secure Communication:
- **API Security:**
  - Uses HTTPS for API requests and responses.
---
## Reporting a Vulnerability
We take the security of our Potato CRM application seriously, and we appreciate the assistance of the security community in identifying and addressing potential vulnerabilities. If you discover a security issue, we encourage you to responsibly disclose it to us by following the guidelines below:

### Reporting Process:
1. **GitHub Issue:**
   - Report security vulnerabilities by creating a new issue on our GitHub repository.
   - Clearly title the issue with "[Security]" for quick identification.
2. **Confidentiality:**
   - When reporting a vulnerability, please refrain from disclosing it publicly until we've had a chance to address the issue.
3. **Provide Details:**
   - Include detailed information about the vulnerability, including steps to reproduce, potential impact, and any other relevant details.
4. **Contact Information:**
   - Optionally, you may provide your contact information in case further clarification is needed.

**Note:** Please understand that not all reported issues may be valid vulnerabilities, but we appreciate your effort in bringing them to our attention.

Thank you for contributing to the security of Potato CRM application. Your collaboration helps us maintain a secure environment for our users.
