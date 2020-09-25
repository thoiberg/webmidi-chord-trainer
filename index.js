WebMidi.enable(function (err) {
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);

    if (err) {
        console.log(`Something went wrong! ${e}`)
        return
    }

    // if the value matches the chord increment a score counter by 1
    // if it doesn't, stop the game
    // On first key press trigger a 5 second timeout
    // if timeout executes then stop the game
    // if chord is correct cancel timeout
    // have a chords object, key chord name -> individual keys
    // when game starts, randomly pick one
    // when chord is successful randomly pick another one

    let input  = WebMidi.inputs[0]

    let currentNotes = []
    let score = 0
    let currentChord = ["C", "E", "G"]
    let currentChordName = "Cmaj"
    let chords = {
      "Cmaj7": ["C", "E", "G", "B"],
      "C7": ["C", "E", "G", "A#"],
      "Fmaj7": ["F", "A", "C", "E"],
      "Gmin7": ["G", "A#", "D", "F"],
      "G7": ["G", "B", "D", "F"],
      "Gb7": ["F#", "A#", "C#", "E"],
      "Gbmaj7": ["F#", "A#", "C#", "F"],
      "F#min7": ["F#", "A", "C#", "E"]
    }
    let isPlaying = false
    let resultElement = document.getElementById("result")
    let timeOutId = null
    let timerBar = document.getElementById("timer-bar")

    const startGameButton = document.getElementById("start-game")
    startGameButton.addEventListener("click", () => {
      !isPlaying && startGame()
    })

    function startGame() {
      score = 0
      isPlaying = true
      stopCountdown()

      getRandomChord()
      setCurrentChordName()
      startCountdown()
    }

    function getRandomChord() {
      const chordKeys = Object.keys(chords)
      const index = getRandomArbitrary(0, chordKeys.length)
      const chordName = chordKeys[index]

      currentChordName = chordName
      currentChord = chords[chordName]
    }

    function getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    }

    function nextRound() {
      // clearTimeout
      stopCountdown()
      // randomly pick new chord
      getRandomChord()
      setCurrentChordName()
      // startTimeout
      setTimeout(startCountdown, 500)
    }

    function setCurrentChordName() {
      const chordNameElement = document.getElementById('chord-name')
      chordNameElement.innerText = `Press: ${currentChordName}`
    }

    function checkChord() {
      currentNotes.sort()
      currentChord.sort()

      if (currentChord.toString() == currentNotes.toString()) {
        score += 1
        resultElement.innerText = `Score: ${score}`

        nextRound()
      } else {
        stopCountdown()
        resultElement.innerText = `Final Score: ${score}`
        isPlaying = false
      }
    }

    function startCountdown() {
      timerBar.classList.add("running-out")
      timeOutId = setTimeout(function() {
        alert("time's run out!")
        isPlaying = false
      }, 5000)
    }

    function stopCountdown() {
      timerBar.classList.remove("running-out")
      clearTimeout(timeOutId)
    }

    input.addListener('noteon', "all",
    (e) => {
      console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
      console.log("e: ", e)
      const key = document.getElementsByClassName(e.note.name)[0]

      key.setAttribute('style', 'background-color: grey')
      currentNotes.push(e.note.name)

      if (isPlaying && currentNotes.length === 1) {
        setTimeout(function() {
          checkChord()
        }, 50)
      }
    });

    input.addListener('noteoff', 'all', (e) => {
        console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
      const key = document.getElementsByClassName(e.note.name)[0]

      key.removeAttribute('style')
      // remove note from state object
      currentNotes = currentNotes.filter(x => x != e.note.name)
    })

    // to play a note
    // let output = WebMidi.outputs[0]
    // output.playNote("C3")
});
