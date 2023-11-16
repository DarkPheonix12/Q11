import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import All from "./discussViews/AllQuestions";
import Impacts from "./discussViews/Impacts";
import Saved from "./discussViews/Saved";
import Quriosity from "./discussViews/Quriosity";
import DiscussMenu from "./DiscussMenu";
import QA from "./discussViews/question/Question";
import AddQuestionButton from "./discussViews/AddQuestionButton";
import PrivateRoute from "../../helperComponents/PrivateRoute";

const Discuss: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <>
      {!path.match("/home/discuss/answer") &&
        !path.match("/home/discuss/question") && <DiscussMenu />}
      <section className="discuss">
        <Switch>
          <Route exact path="/home/discuss/all" component={All} />
          <PrivateRoute
            exact
            path="/home/discuss/impacts"
            component={Impacts}
          />
          <PrivateRoute
            exact
            path="/home/discuss/quriosity"
            component={Quriosity}
          />
          <PrivateRoute exact path="/home/discuss/saved" component={Saved} />
          <Route
            exact
            path="/home/discuss/question/:questionId"
            component={QA}
          />
          <Route path="/home/discuss/" render={() => <h1>404 Not Found</h1>} />
        </Switch>
        {!path.match("/home/discuss/answer") &&
          !path.match("/home/discuss/question") && <AddQuestionButton />}
      </section>
    </>
  );
};

export default Discuss;
