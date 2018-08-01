let PLAYERS = [
    {
        name: "John Doe",
        score: 69,
        id: 1,
    },
    {
        name: "Jane Doe",
        score: 35,
        id: 2,
    },
    {
        name: "Don",
        score: 12,
        id: 3,
    },
    {
        name: "Franky",
        score: 0,
        id: 4,
    }
];

function Header(props) {
    return (
        <div className="header">
            <Stats players={props.players} />
            <h1>{props.title}</h1>
            <Stopwatch />
        </div>
    );
}

Header.propTypes = {
    title: React.PropTypes.string.isRequired,
    players: React.PropTypes.array.isRequired,
}

function Player(props) {

    return (
        <div className="player">
            <div className="player-name">
                <a className="remove-player" onClick={props.onRemove}>X</a>
                {props.name}
            </div>
            <div className="player-score">
                <Counter score={props.score} onChange={props.onScoreChange} />
            </div>
        </div>
    );
}

Player.propTypes = {
    name: React.PropTypes.string.isRequired,
    score: React.PropTypes.number,
    onScoreChange: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
}

Player.defaultProps = {
    score: 0,
}



const Counter = (props) => {
    return (
        <div className="counter" >
            <button className="counter-action decrement" onClick={() => { props.onChange(-1); }}> - </button>
            <div className="counter-score"> {props.score} </div>
            <button className="counter-action increment" onClick={() => { props.onChange(1); }}> + </button>
        </div >
    );
}

Counter.propTypes = {
    score: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
}

const Stats = (props) => {
    let totalPlayers = props.players.length;
    let totalPoints = props.players.reduce((total, player) => {
        return total + player.score;
    }, 0);
    // Other way:
    // let totalPoints = 0;
    // props.players.forEach((player) => {
    //     totalPoints += player.score;
    // });

    return (
        <table className="stats">
            <tbody>
                <tr>
                    <td>Players:</td>
                    <td>{totalPlayers}</td>
                </tr>
                <tr>
                    <td>Total Points:</td>
                    <td>{totalPoints}</td>
                </tr>
            </tbody>
        </table>
    );
}

Stats.propTypes = {
    players: React.PropTypes.array.isRequired,

}

class AddPlayerForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
        }
        this.onNameChange = this.onNameChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onAdd(this.state.name);
        this.setState({
            name: "",
        })
    }

    onNameChange(e) {
        //console.log('onNameChanged', e.target.value);
        this.setState({
            name: e.target.value,
        });
    }

    render() {
        return (
            <div className="add-player-form">
                <form onSubmit={this.onSubmit}>
                    <input type="text" value={this.state.name} onChange={this.onNameChange} />
                    <input type="submit" value="Add Player" />
                </form>
            </div>
        )
    }
}

AddPlayerForm.propTypes = {
    onAdd: React.PropTypes.func.isRequired,
}

class Stopwatch extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="stopwatch">
                <h2>Stopwatch</h2>
                <div className="stopwatch-time">0</div>
                <button>Start</button>
                <button>Reset</button>
            </div>
        )
    }
}

class Application extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            players: this.props.initPlayers,
        }
        this.onPlayerAdd = this.onPlayerAdd.bind(this);
    }

    onScoreChange(index, delta) {
        console.log(`${index}:  ${delta}`);
        this.state.players[index].score += delta;
        this.setState(this.state);
    }

    onPlayerAdd(name) {
        console.log('player added', name);
        this.state.players.push({
            name: name,
            score: 0,
            id: Math.floor(Date.now() / 100),
        })
        this.setState(this.state);
        console.log(this.state);
    }

    onRemovePlayer(index) {
        console.log("Removing Player", index);
        this.state.players.splice(index, 1);
        this.setState(this.state);
    }

    render() {
        return (
            <div className="scoreboard">
                <Header title={this.props.title} players={this.state.players} />
                <div className="players">
                    {this.state.players.map(function (player, index) {
                        return (
                            <Player
                                onScoreChange={delta => { this.onScoreChange(index, delta) }}
                                onRemove={() => { this.onRemovePlayer(index) }}
                                name={player.name}
                                score={player.score}
                                key={player.id} />
                        );
                    }.bind(this))}
                </div>
                <AddPlayerForm onAdd={this.onPlayerAdd} />
            </div>
        )
    }
}

Application.propTypes = {
    title: React.PropTypes.string,
    initPlayers: React.PropTypes.arrayOf(React.PropTypes.shape(
        {
            name: React.PropTypes.string.isRequired,
            score: React.PropTypes.number.isRequired,
            id: React.PropTypes.number.isRequired,
        }
    )).isRequired,
}

Application.defaultProps = {
    title: "Scoreboard",
}

ReactDOM.render(<Application initPlayers={PLAYERS} />, document.getElementById('container'));
