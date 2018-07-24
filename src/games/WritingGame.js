import React from 'react'
import StringSimilarity from 'string-similarity'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import { setAnswer,setLocalStats } from '../reducers/gameReducer'
import { setMessage } from '../reducers/messageReducer'
import { setScoreFlash } from '../reducers/scoreFlashReducer'
import { connect } from 'react-redux'
import imageService from '../services/images'

/**
 * WritingGame (run under Gameloop.js) is the standard game mode of Luupeli.
 * In WritingGame, the player needs to correctly identify each bone image shown. The identification is done by typing in the latin name of the bone.
 * Points are awarded for correct syntax AND speedy response time.
 */
class WritingGame extends React.Component {

  constructor(props) {
    super(props);
    this.timer = 0;
    this.state = {
      value: '',
      seconds: 0.0,
      secondsTotal: 0.0,
      counter: 0,

    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    
    
  }



  handleChange(event) {
    this.setState({ value: event.target.value })
    console.log(this.state.value)
  }

  /**
   * As the player submits the answer, the points will be calculated, gameplay stats will be stored and player message and score flash balloon will be generated.
   * @param {*} event 
   */
  handleSubmit (event) {
    event.preventDefault()

    let correctness = 'Melkein oikein'
    let points = ( Math.round((this.checkCorrectness()*Math.max(10,this.props.currentImage.bone.nameLatin.length))  * ((300+ Math.max(0, (300-this.state.seconds )))/600)) ) / 20
    
    if (this.state.seconds<100) {
      points=points*((100-this.state.seconds)/10)
    }

    if (this.checkCorrectness()>99) {
      points=points*10
      correctness = 'Oikein'
  
    } else if (this.checkCorrectness()>85) {
      points=points*2
    }

    points=Math.round(points/20)*20      

    if (this.checkCorrectness()<=70) {
      correctness = 'Väärin'
      points=0
    }


    this.props.setLocalStats(this.props.currentImage.bone.nameLatin,this.state.value,correctness,this.state.seconds,this.state.secondsTotal, points)

    this.setState({ value: '' })
    this.props.setAnswer(this.props.currentImage, this.checkCorrectness(), this.state.value)

    this.props.setScoreFlash(points, points+' PTS!!!', 'success')
    this.createMessage(points)
  }

  /**
   * Here we increase the game's internal clock by one unit each tick. 
   * "seconds" refers to the time spent answering the current question, while
   * "secondsTotal" refers to the total time spent answering all the questions so far.
   * 
   * The tick is currently set at 100 milliseconds meaning that 1 actual second is actually 10 tick-seconds.
   * This is done simply to make the time-based scoring feel more granular.
   */
  tick() {
    this.setState(prevState => ({
      seconds:  prevState.seconds + 1,
      secondsTotal: prevState.secondsTotal + 1
    }));
  }

  /**
   * With the component mounting, the game time measuring tick() is set at 100 milliseconds.
   */
  componentWillMount(){
    
    this.interval = setInterval(() => this.tick(), 100);
}

/**
 * At component unmount the interval needs to be cleared.
 */
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  

  /**
   * This method measures the "correctness" (or similarity) of the answer string compared to the actual latin name string.
   * The similarity is scaled from 0 to 100, with 100 being a 100 % correct answer.
   * This method should probably be developed further, perhaps with similarity being measured on a word-to-word basis rather than as a full string.
   * Also, disregarding case is not proper, as the latin names ARE case-sensitive.
   */
  checkCorrectness() {
    return 100 * StringSimilarity.compareTwoStrings(this.props.currentImage.bone.nameLatin.toLowerCase(), this.state.value.toLowerCase()); // calculate similarity   
  }

  /**
   * Here we generate a message for the player which indicates how correct the answer was.
   * Answers with similarity of 70 or more are considered as "almost correct" and awarded some points.
   * Answers with similarity of 100 are considered as truly correct.
   * 
   * @param {*} points ... the amount of points awarded for the answer.
   */
  createMessage(points) {
    const similarity = this.checkCorrectness()

    if (this.props.currentImage.bone.nameLatin.toLowerCase() === this.state.value.toLowerCase()) {
      this.props.setMessage('Oikein! ' + points+ ' pistettä!', 'success')
      
      this.setState({
      
        seconds: 0
        
      })
      
      
    } else if (similarity > 70) {
      this.props.setMessage('Melkein oikein! ' + points+ ' pistettä! (similarity: ' + similarity.toPrecision(2) + '). Vastasit: ' + this.state.value.toLowerCase() + '. Oikea vastaus oli ' + this.props.currentImage.bone.nameLatin.toLowerCase(), 'warning')
    } else {
      this.props.setMessage('Väärin (similarity: ' + similarity.toPrecision(2) + ')! Oikea vastaus oli ' + this.props.currentImage.bone.nameLatin.toLowerCase(), 'danger')
      
      this.setState({
      
        seconds: 0
        
      })
    }
    console.log(this.state)
    
  }


/**
 * Notice that the bone images are fethched from Cloudinary, with a resize transformation done based on the measured window size.
 */
  render() {
    const imageWidth = () => {              // Here we try to measure the window size in order to resize the bone image accordingly
      const windowWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      )

      if (windowWidth > 400) {
        return 600
      }
      return windowWidth - 40
    }

    let attempts = this.props.currentImage.attempts
    let correctAttempts = this.props.currentImage.correctAttempts
    let correctPercentile = Math.round(100*(correctAttempts/attempts))
    if (correctPercentile===NaN || correctPercentile<0) {correctPercentile = 0}

    return (
      <div class="bottom">
        <div class="row" id="image-holder">
          <div class="intro">
            <CloudinaryContext cloudName="luupeli">
              <div class="height-restricted">
                <Image publicId={this.props.currentImage.url}>
                  <Transformation width={imageWidth()} crop="fill" radius="20" />
                </Image>


                {/* <div class="gamepix">         // This is a weak attempt at "stacking" the bone images on top of each other. It looked really bad...
                {this.props.game.images.map((img) =>
                <Image publicId={img.url}>
     <Transformation width={imageWidth()} crop="fill" radius="20" position="fixed"/>
    </Image> 
  )
}*/}

              </div>
            </CloudinaryContext>
          </div>
        </div>
        <div class="row">
          <div><center>
            <h3 id="heading">{this.props.currentImage.bone.name}</h3></center>
          </div>
        </div>
        <div class="container">
          <div class="col-md-6 col-md-offset-3" id="info">
          <h6>Vastausaikaa kulunut {Math.round(this.state.seconds/10,1)}</h6>
            <p>{this.props.currentImage.bone.description}</p>
            <p>Tätä kuvaa on yritetty {attempts} kertaa, niistä {correctAttempts} oikein. Oikeita vastauksia: {correctPercentile} % kaikista yrityksistä.</p>
            <p>(Oikea vastaus: {this.props.currentImage.bone.nameLatin})</p>
          </div>
        </div>
        <div class="answer-input">
          <div class="container">
            <div class="intro" />
            <form
              className="input"
              class="form-inline"
              id='gameForm'
              onSubmit={this.handleSubmit}
            >
              <div class="form-groupbd">
                <input
                  class="form-control"
                  id="gameTextInput"
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </div>
              <div className={"btn-group" + this.state.style + " GameButton"}>
                <button type="submit" id="submitButton">Vastaa</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game
  }
}

const mapDispatchToProps = {
  setAnswer,
  setLocalStats,
  setMessage,
  setScoreFlash
}

const ConnectedWritingGame = connect(
  mapStateToProps,
  mapDispatchToProps
)(WritingGame)
export default ConnectedWritingGame
