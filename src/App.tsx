import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { isMobile } from "react-device-detect";
import SignInView from "./components/landing/SignInView";
import "./css/main.css";
import store from "./redux/store";
import Main from "./components/main/Main";
import Landing from "./components/landing/Landing";
import CreateQuestion from "./components/main/discuss/CreateQuestion";
import LandingDesktop from "./components/landing/LandingDesktop/LandingDesktop";
import Notifications from "./components/helperComponents/Notifications";
import { loadLoggedInUser } from "./helperFunctions/firebaseUserActions";
import ScrollToTop from "./components/helperComponents/ScrollToTop";
import PrivateRoute from "./components/helperComponents/PrivateRoute";
import PostView from "./components/main/posts/PostView";
import PostViewQuestionAllAnswers from "./components/main/posts/postViewComponents/postViewQuestion/PostViewQuestionAnswers/PostViewQuestionAllAnswers";
import CreatePostView from "./components/main/posts/CreatePostView";
import EditPostView from "./components/main/posts/EditPostView";

const App = () => {
  useEffect(() => {
    loadLoggedInUser();
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <div className="container">
          <ScrollToTop />
          <Switch>
            <Route
              exact
              path="/"
              component={isMobile ? Landing : LandingDesktop}
            />
            <Route path="/sign-in" render={SignInView} />

            <Route path="/home" component={Main} />
            <Route exact path="/post/:postId" component={PostView} />
            <Route
              exact
              path="/post/:postId/:questionId"
              component={PostViewQuestionAllAnswers}
            />
            <PrivateRoute
              exact
              path="/create-question"
              component={CreateQuestion}
            />
            <PrivateRoute
              exact
              path="/create/:postType"
              component={CreatePostView}
            />
            <PrivateRoute exact path="/edit/:postId" component={EditPostView} />

            <Route path="/" render={() => <h1>404 Not Found</h1>} />
          </Switch>
          <Notifications />
        </div>
      </Router>
    </Provider>
  );
};
export default App;
