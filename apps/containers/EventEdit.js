import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  View, StyleSheet, Text, TouchableOpacity, Animated, Easing
} from 'react-native';
import {mergeDeep, addInCalendar, removeInCalendar} from '../utils/utils';
import * as TreeActions from '../actions/treeActions';
import RNCalendarEvents from 'react-native-calendar-events';
import { Actions as NavActions } from 'react-native-router-flux';

import { width, 
  height, 
  REG_PADDING, 
  container as ctnStyles, 
  contentContainer, 
  textReg,
  titleReg,
  TEXT_PADDING, 
  BIG_FONT_SIZE,
  formStyleSheet,
  dateFieldSS,
  BG_COLOR,
	TRADE_GOTHIC,
  formatDate,
	BORDER_COLOR,
  monthNames
} from '../utils/globalStyles';

import FakeCheckbox from '../components/FakeCheckbox'; 
import datepicker from '../components/DatePickerCustomTemplate';

import t from 'tcomb-form-native';
const Form = t.form.Form;
t.form.Form.stylesheet = formStyleSheet;

const EventModel = t.struct({
  title: t.String,
  date: t.Date,

});

const ctnWidth = (width - REG_PADDING * 2);
let datess = mergeDeep({}, formStyleSheet);
datess = mergeDeep(datess, dateFieldSS);
datess = mergeDeep(datess, {
  formGroup: {
    normal: {
      paddingLeft: 0,
      width: ctnWidth
    }
  },
  dateTouchable: {
    normal: {
      width: ctnWidth
    }
  },
  datepicker: {
    normal: {
      width: ctnWidth
    }
  },
  dateValue: {
    normal: {
      fontFamily: TRADE_GOTHIC,
      fontSize: 12
    }
  },
  controlLabel: {
    normal: {
      fontFamily: TRADE_GOTHIC,
      fontSize:12,
      width: ctnWidth * 0.75
    }
  }
});

const formOptions = {
  auto: 'placeholders',
  autoCapitalize: 'characters',
  stylesheet: formStyleSheet,
  fields: {
    title: {
      placeholder: 'YOUR EVENT NAME'
    },
    date: {
      template: datepicker,
      stylesheet: datess,
      config: {
        format: formatDate
      }
    }
  }
};


class EventEdit extends Component {
	constructor(props) {
  	super(props);
  	this.defaultValues = {};
  	this.state = {
  		showed: false,
  		bgOpacity: new Animated.Value(0),
  		addY: new Animated.Value(50),
  		insideOpacity: new Animated.Value(0),
  	}
  }

  animateIn () {
  	this.state.bgOpacity.setValue(0);
  	this.state.addY.setValue(50);
  	this.state.insideOpacity.setValue(0);

  	Animated.parallel([
      Animated.timing(this.state.bgOpacity, {
        toValue: 1,
        delay: 0,
        duration: 300
      }),
      Animated.timing(this.state.addY, {
        toValue: 0,
        duration: 400,
        delay: 200,
        easing: Easing.out(Easing.exp)
      }),
      Animated.timing(this.state.insideOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200
      }) 
    ]).start();
  }

  animateOut () {

  	Animated.parallel([
      Animated.timing(this.state.bgOpacity, {
        toValue: 0,
        delay: 0,
        duration: 100,
        delay: 100
      }),
      Animated.timing(this.state.addY, {
        toValue: 20,
        duration: 100,
        easing: Easing.in(Easing.exp)
      }),
      Animated.timing(this.state.insideOpacity, {
        toValue: 0,
        duration: 100
      }) 
    ]).start(event => {
      if(event.finished) {
        NavActions.pop();
      }
    });
  }

  componentDidMount () {
  	console.log('componentDidMount');
  	this.animateIn();
  }

  componentWillUpdate (nextProps, nextState) {
  	if (this.props.note.eventID !== '-1') {
  		if (this.props.note.eventID !== nextProps.note.eventID
				|| (!this.defaultValues.title)) {
	  		RNCalendarEvents.findEventById(nextProps.note.eventID).then((event) => {
	  			this.defaultValues = {
	  				title: event.title,
	  				date:new Date(event.startDate)
	  			};
	  			this.forceUpdate();
	  		});
  		}		
  	} else if (this.props.note.eventID === '-1' && this.defaultValues.title) {
  		this.defaultValues = {};
  	}
  }

  saveEvent () {
  	const validation = this.refs.editEvent.validate();
    if(validation.errors.length <= 0) {
      this.formData = Object.assign({}, validation.value);
      const startDate = new Date(this.formData.date);
      startDate.setHours(8);
      const endDate = new Date(this.formData.date);
      endDate.setHours(20);
      addInCalendar(this.props.note.eventID, this.formData.title, {
      	location: 'location',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
			  alarms: [{
			    date: startDate
			  }]
      }).then(eventID => {
        this.props.actions.saveNote(this.props.treeID, this.props.note.id, this.props.note.note, this.props.note.date, eventID);
      	this.animateOut();
      });
  		// addInCalendar(this.props.note.eventID, );
  	}
  }

  removeEvent () {
  	RNCalendarEvents.removeEvent(this.props.note.eventID)
	  .then(success => {
	    this.props.actions.saveNote(this.props.treeID, this.props.note.id, this.props.note.note, this.props.note.date, "-1");
      this.animateOut();
	  })
  }

  render () {
  	var bgCol = "rgba(0, 0, 0, " + this.state.bgOpacity + ")";
  	return (<Animated.View style={[styles.container, 
  		{ backgroundColor: this.state.bgOpacity.interpolate({
  			inputRange: [0, 1],
  			outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']
  		})}]}>
  		<Animated.View style={[styles.modalCtn, 
  			{ opacity: this.state.insideOpacity, 
  				transform: [{translateY: this.state.addY }] }]}>
  			
				<View>
					<Text style={styles.title}>Add to calendar</Text>
					<Form
            ref="editEvent"
            type={EventModel}
            options={formOptions}
            value={this.defaultValues}
          />
					<TouchableOpacity onPress={() => { this.saveEvent(); }} style={styles.button}>
            <Text style={styles.textButton}>Save</Text>
          </TouchableOpacity>
				</View>
					{this.props.note.eventID !== "-1" ? 
					<TouchableOpacity onPress={() => { this.removeEvent(); }} style={styles.button}>
	          <Text style={styles.textButton}>Remove Event</Text>
	        </TouchableOpacity>
					 : null}
					<TouchableOpacity onPress={() => {
      			this.animateOut();
      			}} style={styles.button}>
	          <Text style={styles.textButton}>Cancel</Text>
	        </TouchableOpacity>
  			</Animated.View>
  		</Animated.View>);
    }
}

const stateToProps = (state) => {
  return {
     treeID: state.tree.id
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

const styles =  StyleSheet.create({
  container: {
  	flex: 0,
  	width,
  	height,
  	position: 'absolute',
  	flexDirection: 'row',
  	alignItems: 'center',
  	justifyContent: 'center'
  },
  modalCtn: {
  	padding: REG_PADDING,
  	flex: 0.5,
  	backgroundColor: '#FFFFFF'
  },
  button: {
    margin: 3,
    borderBottomColor: BORDER_COLOR,
    borderBottomWidth: 1,
  },
  textButton: Object.assign({}, textReg, {
    fontFamily: TRADE_GOTHIC,
    fontSize: 15,
    opacity: 1
  }),
  title: Object.assign({}, titleReg, {
    textAlign: 'left',
    marginBottom: 25
  })
});

export default connect(stateToProps, dispatchToProps)(EventEdit)