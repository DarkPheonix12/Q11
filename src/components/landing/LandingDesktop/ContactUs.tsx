import React, { useState } from "react";
import { addBetaUser } from "../../../helperFunctions/firebaseUserActions";

const ContactUs: React.FC = () => {
  const [formInfo, changeFormInfo] = useState({
    name: "",
    email: "",
    note: "",
  });

  const { name, email, note } = formInfo;

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    changeFormInfo({
      ...formInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addBetaUser(name, email, note);
  };

  return (
    <section className="contact-us">
      <div className="row justify-content-center">
        <div className="col-12">
          <h2 style={{ color: "white" }}>
            Secure a place to try our BETA release!
          </h2>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12 col-md-6 col-xl-4">
          <div className="form">
            <form onSubmit={(e) => onSubmit(e)}>
              <div className="form-row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    onChange={(e) => onChange(e)}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    onChange={(e) => onChange(e)}
                  />
                </div>
              </div>
              <br />
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Note (Optional)"
                  name="note"
                  onChange={(e) => onChange(e)}
                />
              </div>
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#FFB300",
                  padding: "3px 20px",
                  color: "#ffffff",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
