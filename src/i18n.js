import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // 🌐 Navbar
        "Home": "Home",
        "About": "About",
        "Contact": "Contact",
        "Login": "Login",
        "Signup": "Signup",
        "Language": "Language",
        "English": "English",
        "Hindi": "Hindi",
        "View Bills": "View Bills",
        "Add Bills": "Add Bills",
        "Logout": "Logout",
        "Workers": "Workers",
        "Admin Panel":"Admin Panel",

        // search bar
        "Search workers":"Search workers (name, email, phone...)",
        "Search bills":"Search bills (type, date, amount, bill no...)",

        // 🏠 Home Page
        "Mera Bill": "Mera Bill",
        "Next-Gen Billing & Invoice Automation for Modern Organizations":
          "Next-Gen Billing & Invoice Automation for Modern Organizations",
        "Manage Everything in One Place": "Manage Everything in One Place",
        "Track, generate, and analyze all your bills and invoices seamlessly. Mera Bill automates the boring part of your accounting — so you can focus on growth.":
          "Track, generate, and analyze all your bills and invoices seamlessly. Mera Bill automates the boring part of your accounting — so you can focus on growth.",
        "Smart Reports": "Smart Reports",
        "AI-based insights for every transaction and client.":
          "AI-based insights for every transaction and client.",
        "Automation": "Automation",
        "No manual entry — automate recurring invoices instantly.":
          "No manual entry — automate recurring invoices instantly.",
        "Bank-Level Security": "Bank-Level Security",
        "Your data is encrypted and stored securely in the cloud.":
          "Your data is encrypted and stored securely in the cloud.",

        // ℹ️ About Page
        "About Mera Bill": "About Mera Bill",
        "Mera Bill is a next-generation billing and invoice automation tool designed for modern businesses. It helps organizations manage transactions, generate bills, and gain insights from data efficiently.":
          "Mera Bill is a next-generation billing and invoice automation tool designed for modern businesses. It helps organizations manage transactions, generate bills, and gain insights from data efficiently.",
        "Our Mission": "Our Mission",
        "To simplify and automate billing for every Indian business — from small shops to large enterprises.":
          "To simplify and automate billing for every Indian business — from small shops to large enterprises.",
        "Our Vision": "Our Vision",
        "A digital-first India where every transaction is transparent, secure, and automated.":
          "A digital-first India where every transaction is transparent, secure, and automated.",
        "Key Features": "Key Features",
        "Automated Invoice Generation": "Automated Invoice Generation",
        "Real-time Smart Reports": "Real-time Smart Reports",
        "Multi-language Interface": "Multi-language Interface",
        "Bank-level Data Security": "Bank-level Data Security",
        "Role-based Access for Managers and Workers": "Role-based Access for Managers and Workers",

        // 📞 Contact Page
        "Get in Touch ✨": "Get in Touch ✨",
        "We’d love to hear from you — let’s make billing simple together!":
          "We’d love to hear from you — let’s make billing simple together!",
        "Email": "Email",
        "Phone": "Phone",
        "Address": "Address",
        "Need Help? 💬": "Need Help? 💬",
        "Tell us your issue — we’ll respond quickly!":
          "Tell us your issue — we’ll respond quickly!",
        "Your Name": "Your Name",
        "Your Email": "Your Email",
        "Describe your issue...": "Describe your issue...",
        "Send Message": "Send Message",
        "✅ Message sent successfully!": "✅ Message sent successfully!",
        "❌ Failed to send message. Please try again later.":
          "❌ Failed to send message. Please try again later.",
        "⚠️ Server error. Check your backend connection.":
          "⚠️ Server error. Check your backend connection.",

        // 🔑 Login Page
        "Welcome Back 👋": "Welcome Back 👋",
        "Login to your MeraBill account": "Login to your MeraBill account",
        "Email Address": "Email Address",
        "Password": "Password",
        "Don’t have an account?": "Don’t have an account?",
        "Sign Up": "Sign Up",
        "Login 🚀": "Login 🚀",

        // 🧾 Signup Page
        "Create Your Account": "Create Your Account",
        "Manager": "Manager",
        "Worker": "Worker",
        "Full Name": "Full Name",
        "Phone Number": "Phone Number",
        "Already have an account?": "Already have an account?",
        "Welcome! Choose your role and create an account to start using Mera Bill.":
          "Welcome! Choose your role and create an account to start using Mera Bill.",

        // ⚙️ Footer
        "Smart Billing. Simple Management. Total Control.":
          "Smart Billing. Simple Management. Total Control.",
        "All rights reserved.": "All rights reserved.",

        // worker home
        "Please login as worker.": "Please login as worker.",
        "Loading dashboard...": "Loading dashboard...",
        "Your Bills": "Your Bills",
        "Your Activity (Last 6 Months)": "Your Activity (Last 6 Months)",
        "Recent Bills": "Recent Bills",
        "No recent bills": "No recent bills",

         // ViewBill Page
      "Loading bills...": "Loading bills...",
      "No bills uploaded yet.": "No bills uploaded yet.",
      "Are you sure you want to delete this bill?": "Are you sure you want to delete this bill?",
      "Bill deleted successfully!": "Bill deleted successfully!",
      "Bill updated successfully!": "Bill updated successfully!",
      "No Date": "No Date",
      "Type": "Type",
      "Amount": "Amount",
      "Bill No": "Bill No",
      "Date":"Date",
      "Uploaded By:": "Uploaded By:",
      "Edit": "Edit",
      "Delete": "Delete",
      "Save": "Save",
      "Cancel": "Cancel",
      "N/A": "N/A",
      "Bill": "Bill",

      // Add bill
    "Add New Bill": "Add New Bill",
    "Bill Type": "Bill Type",
    "Select Bill Type": "Select Bill Type",
    "Light Bill": "Light Bill",
    "Petrol Pump Bill": "Petrol Pump Bill",
    "Food Bill": "Food Bill",
    "Shopping Bill": "Shopping Bill",
    "Medical Bill": "Medical Bill",
    "Transport Bill": "Transport Bill",
    "Enter amount": "Enter amount",
    "Bill Number": "Bill Number",
    "Upload Bill": "Upload Bill",
    "Please upload bill image!": "Please upload bill image!",
    "Bill uploaded successfully!": "Bill uploaded successfully!",
    "Upload failed!": "Upload failed!",

    // profile page
     "Loading...": "Loading...",
    "User Profile": "User Profile",
    "Profile": "Profile",
    "Name": "Name",
    "Organization": "Organization",
    "Role": "Role",
    "Edit Profile": "Edit Profile",

    // Admin Dashboard
      "Please login as admin and try again.": "Please login as admin and try again.",
      "Org Bills": "Org Bills",
      "Bills in last 6 months": "Bills in last 6 months",
      "Bill Types": "Bill Types",
      "No bills yet": "No bills yet",
      "Failed to load dashboard data. Check backend.": "Failed to load dashboard data. Check backend.",

      // Workers Page
      "Workers of": "Workers of",
      "Failed to load workers": "Failed to load workers",
      "Server connection error": "Server connection error",
      "No workers found.": "No workers found.",

      },
    },
    hi: {
      translation: {
        // 🌐 Navbar
        "Home": "मुख्य पृष्ठ",
        "About": "हमारे बारे में",
        "Contact": "संपर्क करें",
        "Login": "लॉगिन",
        "Signup": "साइनअप",
        "Language": "भाषा",
        "English": "अंग्रेज़ी",
        "Hindi": "हिन्दी",
        "View Bills": "बिल देखें",
        "Add Bills": "बिल जोड़ें",
        "Logout": "लॉग आउट",
        "Workers": "कर्मचारी",
        "Admin Panel":"प्रशासन पैनल",

        // search bar
        "Search workers":"कर्मचारियों को खोजें (नाम, ईमेल, फ़ोन...)",
        "Search bills":"बिल खोजें (प्रकार, तारीख, राशि, बिल नंबर...)",


        //  Home Page
        "Mera Bill": "मेरा बिल",
        "Next-Gen Billing & Invoice Automation for Modern Organizations":
          "आधुनिक संगठनों के लिए नेक्स्ट-जेन बिलिंग और इनवॉइस ऑटोमेशन",
        "Manage Everything in One Place": "सब कुछ एक ही जगह प्रबंधित करें",
        "Track, generate, and analyze all your bills and invoices seamlessly. Mera Bill automates the boring part of your accounting — so you can focus on growth.":
          "अपने सभी बिल और इनवॉइस को ट्रैक करें, बनाएं और विश्लेषण करें। मेरा बिल आपके अकाउंटिंग के उबाऊ हिस्से को ऑटोमेट करता है ताकि आप विकास पर ध्यान दे सकें।",
        "Smart Reports": "स्मार्ट रिपोर्ट्स",
        "AI-based insights for every transaction and client.":
          "हर लेनदेन और ग्राहक के लिए एआई-आधारित इनसाइट्स।",
        "Automation": "स्वचालन",
        "No manual entry — automate recurring invoices instantly.":
          "कोई मैनुअल एंट्री नहीं — दोहराए जाने वाले इनवॉइस को तुरंत ऑटोमेट करें।",
        "Bank-Level Security": "बैंक-स्तरीय सुरक्षा",
        "Your data is encrypted and stored securely in the cloud.":
          "आपका डेटा एन्क्रिप्ट किया गया है और सुरक्षित रूप से क्लाउड में संग्रहीत है।",

        // ℹ️ About Page (Full)
        "About Mera Bill": "मेरा बिल के बारे में",
        "is a smart billing and invoice management web app built for organizations and startups. It automates billing, tracks transactions, and keeps your accounts up to date with next-gen analytics and security.":
          "एक स्मार्ट बिलिंग और इनवॉइस प्रबंधन वेब ऐप है जो संगठनों और स्टार्टअप्स के लिए बनाया गया है। यह बिलिंग को स्वचालित करता है, लेनदेन को ट्रैक करता है और आपके खातों को उन्नत विश्लेषण और सुरक्षा के साथ अद्यतन रखता है।",
        "Our platform is designed to simplify complex finance workflows so you can focus on what really matters — growing your business with confidence and clarity.":
          "हमारा प्लेटफ़ॉर्म जटिल वित्तीय प्रक्रियाओं को सरल बनाने के लिए डिज़ाइन किया गया है ताकि आप आत्मविश्वास और स्पष्टता के साथ अपने व्यवसाय को बढ़ाने पर ध्यान केंद्रित कर सकें।",
        "Billing management": "बिलिंग प्रबंधन",
        "Our Mission": "हमारा मिशन",
        "To make billing simple, transparent, and automated for every business — big or small.":
          "हर व्यवसाय — बड़ा या छोटा — के लिए बिलिंग को सरल, पारदर्शी और स्वचालित बनाना।",
        "Our Vision": "हमारा विज़न",
        "To be India’s most trusted billing and finance automation platform by empowering organizations digitally.":
          "संगठनों को डिजिटल रूप से सशक्त बनाकर भारत का सबसे विश्वसनीय बिलिंग और वित्त स्वचालन प्लेटफ़ॉर्म बनना।",
        "Why Choose Us": "हमें क्यों चुनें",
        "Seamless UI, real-time analytics, and cloud security — all in one powerful billing ecosystem.":
          "सहज यूआई, रियल-टाइम एनालिटिक्स और क्लाउड सुरक्षा — एक ही शक्तिशाली बिलिंग ईकोसिस्टम में।",
        // 📞 Contact Page
        "Get in Touch ✨": "संपर्क करें ✨",
        "We’d love to hear from you — let’s make billing simple together!":
          "हम आपसे सुनना पसंद करेंगे — आइए बिलिंग को एक साथ आसान बनाते हैं!",
        "Email": "ईमेल",
        "Phone": "फ़ोन",
        "Address": "पता",
        "Need Help? 💬": "मदद चाहिए? 💬",
        "Tell us your issue — we’ll respond quickly!":
          "हमें अपनी समस्या बताएं — हम जल्द ही जवाब देंगे!",
        "Your Name": "आपका नाम",
        "Your Email": "आपका ईमेल",
        "Describe your issue...": "अपनी समस्या का विवरण दें...",
        "Send Message": "संदेश भेजें ",
        "✅ Message sent successfully!": "✅ संदेश सफलतापूर्वक भेजा गया!",
        "❌ Failed to send message. Please try again later.":
          "❌ संदेश भेजने में विफल। कृपया बाद में पुनः प्रयास करें।",
        "⚠️ Server error. Check your backend connection.":
          "⚠️ सर्वर त्रुटि। अपने बैकएंड कनेक्शन की जांच करें।",

        // 🔑 Login Page
        "Welcome Back 👋": "वापसी पर स्वागत है 👋",
        "Login to your MeraBill account": "अपने मेरा बिल खाते में लॉगिन करें",
        "Email Address": "ईमेल पता",
        "Password": "पासवर्ड",
        "Don’t have an account?": "क्या आपका खाता नहीं है?",
        "Sign Up": "साइन अप करें",
        "Login 🚀": "लॉगिन 🚀",

        // 🧾 Signup Page
        "Create Your Account": "अपना खाता बनाएँ",
        "Manager": "प्रबंधक",
        "Worker": "कर्मी",
        "Full Name": "पूरा नाम",
        "Phone Number": "फ़ोन नंबर",
        "Already have an account?": "क्या आपके पास पहले से खाता है?",
        "Welcome! Choose your role and create an account to start using Mera Bill.":
          "स्वागत है! अपनी भूमिका चुनें और मेरा बिल का उपयोग शुरू करने के लिए एक खाता बनाएं।",

        // ⚙️ Footer
        "Smart Billing. Simple Management. Total Control.":
          "स्मार्ट बिलिंग। सरल प्रबंधन। सम्पूर्ण नियंत्रण।",
        "All rights reserved.": "सभी अधिकार सुरक्षित।",

        // worker home
        "Please login as worker.": "कृपया वर्कर के रूप में लॉगिन करें।",
        "Loading dashboard...": "डैशबोर्ड लोड हो रहा है...",
        "Your Bills": "आपके बिल",
        "Your Activity (Last 6 Months)": "आपकी गतिविधि (पिछले 6 महीनों में)",
        "Recent Bills": "हाल के बिल",
        "No recent bills": "कोई हाल के बिल नहीं",

         // ViewBill Page
      "Loading bills...": "बिल लोड हो रहे हैं...",
      "No bills uploaded yet.": "अभी तक कोई बिल अपलोड नहीं किया गया।",
      "Are you sure you want to delete this bill?": "क्या आप वाकई इस बिल को हटाना चाहते हैं?",
      "Bill deleted successfully!": "बिल सफलतापूर्वक हटाया गया!",
      "Bill updated successfully!": "बिल सफलतापूर्वक अपडेट किया गया!",
      "No Date": "कोई तिथि नहीं",
      "Type": "प्रकार",
      "Amount": "राशि",
      "Bill No": "बिल नंबर",
      "Uploaded By:": "अपलोड किया गया:",
      "Edit": "संपादित करें",
      "Date":"तारीख",
      "Delete": "हटाएं",
      "Save": "सहेजें",
      "Cancel": "रद्द करें",
      "N/A": "उपलब्ध नहीं",
      "Bill": "बिल",

      // Add bill
      "Add New Bill": "नया बिल जोड़ें",
    "Bill Type": "बिल का प्रकार",
    "Select Bill Type": "बिल का प्रकार चुनें",
    "Light Bill": "बिजली का बिल",
    "Petrol Pump Bill": "पेट्रोल पंप बिल",
    "Food Bill": "खाद्य बिल",
    "Shopping Bill": "खरीदारी बिल",
    "Medical Bill": "चिकित्सा बिल",
    "Transport Bill": "यातायात बिल",
    "Enter amount": "राशि दर्ज करें",
    "Bill Number": "बिल संख्या",
    "Upload Bill": "बिल अपलोड करें",
    "Please upload bill image!": "कृपया बिल की छवि अपलोड करें!",
    "Bill uploaded successfully!": "बिल सफलतापूर्वक अपलोड हुआ!",
    "Upload failed!": "अपलोड विफल!",

    // profile page
    "Loading...": "लोड हो रहा है...",
    "User Profile": "उपयोगकर्ता प्रोफ़ाइल",
    "Profile": "प्रोफ़ाइल",
    "Name": "नाम",
    "Organization": "संगठन",
    "Role": "भूमिका",
    "Edit Profile": "प्रोफ़ाइल संपादित करें",

    "Please login as admin and try again.": "कृपया व्यवस्थापक के रूप में लॉगिन करें और पुनः प्रयास करें।",
    "Org Bills": "संगठन के बिल",
    "Bills in last 6 months": "पिछले 6 महीनों में बिल",
    "Bill Types": "बिल प्रकार",
    "No bills yet": "अभी तक कोई बिल नहीं",
    "Failed to load dashboard data. Check backend.": "डैशबोर्ड डेटा लोड करने में विफल। बैकएंड जांचें।",

    // Workers Page
    "Workers of": "के कर्मचारी",
    "Failed to load workers": "कर्मचारियों को लोड करने में विफल",
    "Server connection error": "सर्वर कनेक्शन त्रुटि",
    "No workers found.": "कोई कर्मचारी नहीं मिला।",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
