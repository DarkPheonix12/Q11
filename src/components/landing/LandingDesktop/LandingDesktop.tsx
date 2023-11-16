import React, { useCallback, useEffect, useState } from "react";
import Landing from "./Landing";
import Introduction from "./Introduction";
import Services from "./Services";
import BeCurious from "./BeCurious";
import BeHeard from "./BeHeard";
import BeTogether from "./BeTogether";
import ContactUs from "./ContactUs";
import Footer from "./Footer";
import { connect } from "react-redux";
import { RootState } from "../../../redux";
import { useHistory } from "react-router-dom";

const quoteList1 = [
  "“It is what difference we’ve made in the lives of others, that will determine the significance of the life we lead.” - Nelson Mandella",
  '"Wander...and you may uncover something that totally ends up changing your life." - Q',
  '"Its ordinary to love the beautiful, its beautiful to love the ordinary." - Unknown',
  '"True education is replacing an empty mind with an open one." - Malcolm Forbes',
  '"Our greatest glory is not in never falling, but in rising every time we fall." - Confucius',
  '"Where there is life, there is hope."',
];

const quoteList2 = [
  '"It is up to us whether our eyes and ears hinder the intake of knowledge or enrich it." - Q',
  '"It’s not because things are difficult that we do not dare, it is because we do not dare that things get difficult." - Seneca',
  "“If you want to go fast, go alone...if you want to go far, go together” - Nelson Mandella",
  "\"We're not analytical beings given a beat, we're emotional beings given a brain.\" - Q",
  '"Difficulties are meant to rouse, not discourage. The human spirit is to grow strong by conflict." - Willian Ellery',
];

interface LandingDesktopProps {
  loggedIn: boolean;
  appLoading: boolean;
}

const LandingDesktop: React.FC<LandingDesktopProps> = ({
  loggedIn,
  appLoading,
}) => {
  const [quotes, changeQuotes] = useState({
    quote1: quoteList1[0],
    quote2: quoteList2[0],
  });

  const { quote1, quote2 } = quotes;

  const updateQuotes = useCallback(() => {
    const randQuote1 = () =>
      quoteList1[Math.floor(Math.random() * quoteList1.length)];
    const randQuote2 = () =>
      quoteList2[Math.floor(Math.random() * quoteList1.length)];

    let newQuote1 = randQuote1();
    let newQuote2 = randQuote2();
    while (newQuote1 === quote1) newQuote1 = randQuote1(); // ensures that the quote is always different
    while (newQuote2 === quote2) newQuote2 = randQuote2();

    changeQuotes({
      quote1: newQuote1,
      quote2: newQuote2,
    });
  }, [quote1, quote2]);

  const history = useHistory();

  useEffect(() => {
    loggedIn && history.push("/home");
  }, [loggedIn, history]);

  useEffect(() => {
    const updateQuotesInterval = setInterval(() => updateQuotes(), 5000);

    return () => {
      clearInterval(updateQuotesInterval);
    };
  }, [updateQuotes]);
  return !appLoading ? (
    <div className="container-fluid wrapper">
      <Landing />
      <Introduction />
      <Services />
      <BeCurious />
      <section className="quote">
        <h3>{quote1}</h3>
      </section>
      <BeHeard />
      <section className="quote-2">
        <h3>{quote2}</h3>
      </section>
      <BeTogether />
      <ContactUs />
      <Footer />
    </div>
  ) : null;
};

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.user.loggedIn,
  appLoading: state.appState.loading,
});

export default connect(mapStateToProps)(LandingDesktop);
