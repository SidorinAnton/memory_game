const CARD_VALUES = [
  "+", "+", "=", "=",
  "#", "#", "@", "@",
  "&", "&", "%", "%",
  "<<", "<<", ">>", ">>",
]


function generateCards() {
  const shuffledValues = CARD_VALUES.map(item => item)

  for (let i = CARD_VALUES.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = shuffledValues[i];
    shuffledValues[i] = shuffledValues[j];
    shuffledValues[j] = temp;
  }

  return shuffledValues.map(value => {
    return {
      "value": value,
      "isOpen": false,
    }
  })
}

const Title = () => {
  return (
      <div className="header">
        <h1 className="header__title">Memory Game</h1>
      </div>
  )
}

const Card = ({value, isOpen, cardIndex, onClickCard}) => {
  return (
      <button
          onClick={() => onClickCard(value, cardIndex)}
          className={`card ${isOpen ? "card_open" : ""}`}
      >
        <span className={`card__value ${!isOpen ? "card__value_hide" : ""}`}>{value}</span>
      </button>
  )
}


const Main = () => {
  const [cards, setCards] = React.useState(generateCards())
  const [firstOpenedCard, setFirstOpenedCard] = React.useState(null)
  const [secondOpenedCard, setSecondOpenedCard] = React.useState(null)

  React.useEffect(() => {
    if (cards.every(card => card.isOpen)) {
      if (confirm("Congratulations! Start again?")) {
        location.reload();
      }
    }
  }, [cards])

  React.useEffect(() => {
    if (!firstOpenedCard || !secondOpenedCard) {
      return;
    }

    if (firstOpenedCard.value !== secondOpenedCard.value) {
      setTimeout(() => {
        setCards(prevState => {
          const newState = [...prevState];
          firstOpenedCard.isOpen = false;
          secondOpenedCard.isOpen = false;
          newState[firstOpenedCard.index] = firstOpenedCard;
          newState[secondOpenedCard.index] = secondOpenedCard;
          return newState;
        })
      }, 200)
    }

    setFirstOpenedCard(null);
    setSecondOpenedCard(null);

  }, [cards, firstOpenedCard, secondOpenedCard])


  const onClickCard = (value, index) => {
    const card = cards[index]

    if (card.isOpen) {
      return;
    }

    card.isOpen = true;
    setCards(prevState => {
      const newState = [...prevState];
      newState[index] = card;
      return newState;
    })

    if (firstOpenedCard === null) {
      setFirstOpenedCard({...card, index})
    }

    if (firstOpenedCard && secondOpenedCard === null) {
      setSecondOpenedCard({...card, index})
    }
  }

  return (
      <div className="main">
        <div className="field">
          {cards.map((card, index) => {
            return (
                <Card
                    key={index}
                    cardIndex={index}
                    value={card.value}
                    isOpen={card.isOpen}
                    onClickCard={onClickCard}
                />
            )
          })}
        </div>
      </div>
  )
}


const App = () => {
  return (
      <div className="content">
        <Title/>
        <Main/>
      </div>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"))
