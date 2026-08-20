"use client";

import React, { useState } from 'react';
import { asset } from '@/lib/asset';
import './Contact.css';

const MAILER_URL = process.env.NEXT_PUBLIC_MAILER_API;

function Contact() {
  const [contactData, setContactData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userSubject: "",
    userMessage: "",
  });

  const [formErrors, setFormErrors] = useState({});

 const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "userName") {
    const onlyLetters = value.replace(/[0-9]/g, "");

    setContactData({
      ...contactData,
      [name]: onlyLetters,
    });
  } else if (name === "userPhone") {
    const onlyNumbers = value.replace(/\D/g, "");

    setContactData({
      ...contactData,
      [name]: onlyNumbers,
    });
  } else {
    setContactData({
      ...contactData,
      [name]: value,
    });
  }
};

  const validateForm = () => {

    let validationErrors = {};

    if (!contactData.userName.trim()) {
      validationErrors.userName = "Name is required";
    }

    if (!contactData.userEmail.trim()) {

      validationErrors.userEmail = "Email is required";
      if (!contactData.userPhone.trim()) {
 
validationErrors.userPhone = "Phone is required";
} else if (!/^[0-9]{10}$/.test(contactData.userPhone)) {
  validationErrors.userPhone = "Enter valid 10 digit phone number";
}

    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactData.userEmail)
    ) {

      validationErrors.userEmail = "Invalid Email";
    }

      if (!contactData.userSubject.trim()) {
      validationErrors.userPhone = "Phone is required";
    }

    if (!contactData.userSubject.trim()) {
      validationErrors.userSubject = "Subject is required";
    }

    if (!contactData.userMessage.trim()) {
      validationErrors.userMessage = "Message is required";
    }

    setFormErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const submitContactForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(MAILER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactData.userName,
          email: contactData.userEmail,
          phone: contactData.userPhone,
          sub: contactData.userSubject,
          message: contactData.userMessage,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setContactData({
        userName: "",
        userEmail: "",
        userPhone: "",
        userSubject: "",
        userMessage: "",
      });

      setFormErrors({});
      setSuccessMessage("Message Sent Successfully ✅");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setSuccessMessage("Something went wrong. Please try again. ❌");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

const [successMessage, setSuccessMessage] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div>
        <section className="contact-section" id="enquiry">
  <div className="contact-container">

    {/* <!-- Left Content --> */}
    <div className="contact-left">

      <p className="contact-tag">CONTACT US</p>

      <h2>
        We'd Love to <br/>
        <span>Hear From You</span>
      </h2>

      <p className="contact-text">
        Have a question, suggestion, or partnership idea?
        Our team is here to help. Reach out to us and
        we'll get back to you as soon as possible.
      </p>

      <img src={asset("/images/contact-img.svg")} alt="Product" className="contact-image"/>
    </div>

    {/* <!-- Right Cards --> */}

    <div className ="contact-right">

      <div className="contact-card">
        <div className="icon-circle">
          <img src={asset("/images/msg.svg")} alt="Email Icon" className="icon-image"/>
        </div>
        <h3>Email Us</h3>
        <p>vaiyamnaturals@gmail.com</p>
      </div>

      <div className="contact-card">
        <div className="icon-circle">
          <img src={asset("/images/phone.svg")} alt="Phone Icon" className="icon-image"/>
        </div>
        <h3>Call Us</h3>
        <p>+91 9840264453</p>
      </div>

      <div className="contact-card">
        <div className="icon-circle">
            <img src={asset("/images/location.svg")} alt="Location Icon" className="icon-image"/>
        </div>
        <h3>Visit Us</h3>
        <p>
          KK Nagar, Chennai-600078 <br/>
          Tamil Nadu, India
        </p>
      </div>

      <div className="contact-card">
        <div className="icon-circle">
            <img src={asset("/images/clock.svg")} alt="Clock Icon" className="icon-image"/>
        </div>
        <h3>Business Hours</h3>
        <p>
          Mon – Sat: 10:00 AM – 6:00 PM
        </p>
      </div>

    </div>
  </div>
</section>
  <section className="contact-wrapper-section">

      <div className="contact-main-wrapper">

        {/* LEFT SIDE */}

        <div className="contact-form-side">

          <h2 className="contact-heading">
            Send Us a Message
          </h2>
<div className="leaf-divider">

  <div className="divider-line"></div>

  <div className="leaf-icon">
    <img src={asset("/images/leaf.svg")} alt="leaf"/>
  </div>

  <div className="divider-line"></div>

</div>
          <form onSubmit={submitContactForm}>

            <div className="contact-input-flex">

              {/* NAME */}

              <div className="contact-input-box">

                <input
                  type="text"
                  placeholder="Your Name"
                  name="userName"
                  value={contactData.userName}
                  onChange={handleInputChange}
                  className="contact-input-field"
                />

                {formErrors.userName && (
                  <span className="contact-error-text">
                    {formErrors.userName}
                  </span>
                )}

              </div>

                {/* Phone */}
            <div className="contact-input-box">
              <input
                type="tel"
                placeholder="Phone Number"
                name="userPhone"
                value={contactData.userPhone}
                onChange={handleInputChange}
                className="contact-input-field"
                maxLength={10}
              />

              {formErrors.userPhone && (
                <span className="contact-error-text">
                  {formErrors.userPhone}
                </span>
              )}
            </div>
            </div>

              {/* EMAIL */}

              <div className="contact-input-box">

                <input
                  type="email"
                  placeholder="Your Email"
                  name="userEmail"
                  value={contactData.userEmail}
                  onChange={handleInputChange}
                  className="contact-input-field"
                />

                {formErrors.userEmail && (
                  <span className="contact-error-text">
                    {formErrors.userEmail}
                  </span>
                )}

              </div>

            

            {/* SUBJECT */}

            <div className="contact-input-box">

              <input
                type="text"
                placeholder="Subject"
                name="userSubject"
                value={contactData.userSubject}
                onChange={handleInputChange}
                className="contact-input-field"
              />

              {formErrors.userSubject && (
                <span className="contact-error-text">
                  {formErrors.userSubject}
                </span>
              )}

            </div>

            {/* MESSAGE */}

            <div className="contact-input-box">

              <textarea
                rows="7"
                placeholder="Your Message"
                name="userMessage"
                value={contactData.userMessage}
                onChange={handleInputChange}
                className="contact-textarea-field"
              ></textarea>

              {formErrors.userMessage && (
                <span className="contact-error-text">
                  {formErrors.userMessage}
                </span>
              )}

            </div>

            {/* BUTTON */}
 <div className="send" id="snd">


  <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
       <button
  type="submit"
  className="contact-submit-btn"
  id="send-btn"
  disabled={isSubmitting}
>
  {isSubmitting ? "Sending..." : "Send Message →"}
</button>

{successMessage && (
  <p className="success-message">
    {successMessage}
  </p>
)}

</div>
<div className="privacy-box">

  <div className="privacy-icon">
    <img src={asset("/images/icon.svg")} alt="privacy icon"/>
    <div className="privacy-content">
    <p style={{ color: "black" }}>
      We respect your privacy.<br/>
      Your information is safe with us.
    </p>
    </div>
  </div>

  
  </div>

</div>
          </form>
        </div>

        {/* RIGHT SIDE */}

        <div className="contact-map-side">

          <div className="contact-live-map">

            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=KK+Nagar+Chennai&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>

          </div>

          {/* <div className="contact-location-card">

            <h3 className="contact-location-title">
              Find Us Here
            </h3>

            <p className="contact-location-description">

              #333/97, Lakshmanaswamy Salai,
              KK Nagar, Chennai - 600078,
              Tamil Nadu, INDIA.

            </p>

          </div> */}

        </div>

      </div>

    </section>
    </div>
  )
}

export default Contact;
