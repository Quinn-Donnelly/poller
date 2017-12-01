/*
 *
 * CoursePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { TextField } from 'material-ui';
import styled from 'styled-components';
import { List, ListItem } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ContentSend from 'material-ui/svg-icons/content/send';
import FlatButton from 'material-ui/FlatButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import { blue500 } from 'material-ui/styles/colors';
import makeSelectCoursePage from './selectors';
import { selectClasses } from '../CourseList/selectors';
import { logOut } from '../Login/actions';
import { selectLoggedIn } from '../Login/selectors';
import { makeSelectQuestions } from '../QuestionsPage/selectors';
import { getQuestions } from '../QuestionsPage/actions';
import myImage from '../../img/background1.png';
import { postQuestion } from './actions';

const style = {
  margin: 12,
};
const Title = styled.div`

  margin:0px;
  padding:200px 0px 0px 0px;
  background-image: url(${myImage});
  background-size:cover;
 height:1000px;

  `;

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  errorStyle: {
    color: blue500,
  },
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
};
export class CoursePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      value: 'a',
      currentCourse: {},
      numberOfAnswers: 3,
    };
  }
  state = {
    open: false,
    checked: false,
  };

  componentWillMount() {
    const classes = this.props.Classes.toJS();
    const currentCourse = classes.find((course) => (course.id === this.props.params.courseId));

    this.setState({
      currentCourse,
    });
  }

  componentDidMount() {
    this.props.dispatch(getQuestions());
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open,
    });
  };

  handleChange = (value) => {
    this.setState({
      value,
    });
  };

  render() {
    const questionList = [];
    if (this.state.value === 'b') {
      for (let i = 0; i < this.props.questions.length; i += 1) {
        questionList.push(<ListItem
          key={i.toString()}
          primaryText={this.props.questions[i].text}
          leftIcon={<ContentSend />}
        />);
      }
    }

    return (
      <div>
        <AppBar
          title={this.state.currentCourse.name}
          iconElementLeft={<IconButton onClick={() => this.props.dispatch(goBack())}><ArrowBack /></IconButton>}
          iconElementRight={this.props.logged ? <FlatButton label="Log Out" onClick={() => this.props.exit()} /> : <FlatButton label="Login" />}
        />

        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
        >

          <Tab label="Make Questions" value="a">
            <div>
              <Title>
                <h2 style={styles.headline}>Create and post your question</h2>
                <List>
                  <ListItem key={89}>
                    <TextField
                      hintText="Make a question"
                      errorText="This field is required."
                      floatingLabelText="Make a questionl"
                      rows={1}
                      key={0}
                      multiLine
                      fullWidth
                      style={style}
                      id="question"
                    />
                  </ListItem>
                  <ListItem
                    key={786}
                    primaryText="Answers"
                    nestedItems={[
                      <ListItem key={43}>
                        <TextField
                          key={1}
                          hintText="Make an Answer"
                          floatingLabelText="Make an Answer"
                          rows={1}
                          multiLine
                          fullWidth
                          style={style}
                          id="1"
                          className="answer"
                        />
                      </ListItem>,
                      <ListItem key={123}>
                        <TextField
                          hintText="Make an Answer"
                          floatingLabelText="Make an Answer"
                          key={2}
                          rows={1}
                          fullWidth
                          multiLine
                          style={style}
                          id="2"
                          className="answer"
                        />
                      </ListItem>,
                      <ListItem key={432}>
                        <TextField
                          hintText="Make an Answer"
                          floatingLabelText="Make an Answer"
                          rows={1}
                          key={3}
                          multiLine
                          fullWidth
                          style={style}
                          id="3"
                          className="answer"
                        />
                      </ListItem>,
                      <ListItem key={4}>
                        <RaisedButton label="Add Answer" style={style} />
                      </ListItem>,
                    ]}
                  />
                </List>
                <RaisedButton label="Post Questions" primary style={style} onClick={() => this.props.post()} />
              </Title>
            </div>
          </Tab>
          <Tab label="Questions Status" value="b">
            <div>
              <Title>

                <List>
                  {questionList}
                </List>
              </Title>
            </div>
          </Tab>

        </Tabs>

      </div>
    );
  }
}

CoursePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  Classes: PropTypes.any,
  params: PropTypes.object.isRequired,
  exit: PropTypes.func.isRequired,
  logged: PropTypes.bool,
  post: PropTypes.func.isRequired,
  questions: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  CoursePage: makeSelectCoursePage(),
  Classes: selectClasses(),
  logged: selectLoggedIn(),
  questions: makeSelectQuestions(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    exit: () => dispatch(logOut()),
    fetchQuestions: () => dispatch(getQuestions()),
    post: () => {
      const question = document.getElementById('question').value;
      const answers = [];
      for (let i = 1; i <= 3; i += 1) {
        answers.push(document.getElementById(i.toString()).value);
      }
      dispatch(postQuestion(question, answers));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage);
