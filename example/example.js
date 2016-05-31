const React = require('react'),
      ReactDOM = require('react-dom');

const createProperty = require('../editors').createProperty,
      validators = require('../editors').validators;


var CommentBox = React.createClass({

    getInitialState: function () {
        return {
            comment: createProperty('Initial value')
        }
    },

    setComment: function (e) {
        this.state.comment.set(e.target.value, (v) => { return validators.toString(v).maxLength(20); });
        // Force React to update...
        this.setState({comment: this.state.comment});
    },

    render: function () {
        var style = this.state.comment.error != null ? {'color': 'red'} : {}
        return (
            <div className="commentBox">
                <input type="text"
                       style={style}
                       value={this.state.comment.input}
                       onChange={this.setComment}></input>
                <div>Validated value: {this.state.comment.get()}</div>
                <div style={style}>{this.state.comment.error()}</div>
            </div>
        );
    }
});

ReactDOM.render(<CommentBox />, document.getElementById('content'));
