import DefaultPage from "@/components/default-page";
import { Footer } from "@/components/footer";
import ContactForm from "@/components/forms/contact-page-form";
import Header from "@/components/header";
import React from "react";

const ContactsPage = () => {
  return (
    <DefaultPage>
      <Header />
      <div className="max-w-[1272px] mx-auto px-7 py-5">
        <ContactForm />
      </div>
      <Footer />
    </DefaultPage>
  );
};

export default ContactsPage;