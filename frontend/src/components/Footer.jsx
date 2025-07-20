function Footer() {
  return (
    <footer className="bg-blue-500 text-white p-4 text-center">
      <p>Reflectly v1.0 &copy; 2025</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="#" className="hover:underline">
          Contact
        </a>
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline">
          Export Data
        </a>
      </div>
    </footer>
  );
}

export default Footer;
