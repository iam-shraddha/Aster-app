class User {
  constructor({ email, role, hospitalId, token }) {
    this.email = email;
    this.role = role;
    this.hospitalId = hospitalId;
    this.token = token;
  }

  // Example method to check if the user is an admin
  isAdmin() {
    return this.role === 'Admin';
  }

  // Example method to retrieve a formatted token
  getFormattedToken() {
    return `Bearer ${this.token}`;
  }
}

export default User;
