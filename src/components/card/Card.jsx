import React, { useEffect, useMemo, useState } from 'react';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';
import './styles.scss';

const CARDS = {
	visa: 'visa',
	amex: '^(34|37)',
	mastercard: '^5[1-5]',
	discover: '^6011',
	unionpay: '^62',
	troy: '^9792',
	diners: '^(30[0-5]|36)',
};

const Card = ({
	cardHolder,
	cardNumber,
	cardMonth,
	cardYear,
	cardCvv,
	isCardFlipped,
	currentFocusedElm,
	onCardElementClick,
	cardNumberRef,
	cardHolderRef,
	cardDateRef,
	brand,
}) => {
	const [style, setStyle] = useState(null);

	const cardType = cardNumber => {
		const number = cardNumber;
		let re;
		for (const [card, pattern] of Object.entries(CARDS)) {
			re = new RegExp(pattern);
			if (number.match(re) != null) {
				return card;
			}
		}

		return 'visa'; // default type
	};

	const useCardType = useMemo(() => {
		return cardType(cardNumber);
	}, [cardNumber]);

	const outlineElementStyle = element => {
		return element
			? {
					width: `${element.offsetWidth}px`,
					height: `${element.offsetHeight}px`,
					transform: `translateX(${element.offsetLeft}px) translateY(${element.offsetTop}px)`,
			  }
			: null;
	};

	useEffect(() => {
		if (currentFocusedElm) {
			const style = outlineElementStyle(currentFocusedElm.current);
			setStyle(style);
		}
	}, [currentFocusedElm]);

	const maskCardNumber = cardNumber => {
		return cardNumber.split('');
	};

	return (
		<div className={'mx-auto card-item ' + (isCardFlipped ? '-active' : '')}>
			<div className='card-item__side-front'>
				<div className={`card-item__focus ${currentFocusedElm ? `-active` : ``}`} style={style} />
				<div className='card-item__cover'/>
				<div className='card-item__wrapper'>
					<div className='card-item__top'>
						<img src={'/chip.png'} alt='' className='card-item__chip' />
						<div className='card-item__type'>
							<img alt={brand} src={`/card-type/${brand}.png`} className='card-item__typeImg' />
						</div>
					</div>

					<label
						className='card-item__number'
						ref={cardNumberRef}
						onClick={() => onCardElementClick('cardNumber')}
					>
						<TransitionGroup className='slide-fade-up' component='div'>
							<CSSTransition classNames='slide-fade-up' timeout={250}>
								<div style={{ letterSpacing: 6 }}>{maskCardNumber(cardNumber)}</div>
							</CSSTransition>
						</TransitionGroup>
					</label>
					<div className='card-item__content'>
						<label
							className='card-item__info'
							onClick={() => onCardElementClick('cardHolder')}
							ref={cardHolderRef}
						>
							<div className='card-item__holder'>Card Holder</div>
							<div className='card-item__name'>
								<TransitionGroup component='div' className='slide-fade-up'>
									{cardHolder === 'FULL NAME' ? (
										<CSSTransition classNames='slide-fade-up' timeout={250}>
											<div>FULL NAME</div>
										</CSSTransition>
									) : (
										cardHolder.split('').map((val, index) => (
											<CSSTransition timeout={250} classNames='slide-fade-right' key={index}>
												<span className='card-item__nameItem'>{val}</span>
											</CSSTransition>
										))
									)}
								</TransitionGroup>
							</div>
						</label>
						<div
							className='card-item__date'
							onClick={() => onCardElementClick('cardDate')}
							ref={cardDateRef}
						>
							<label className='card-item__dateTitle'>Expires</label>
							<label className='card-item__dateItem'>
								<SwitchTransition in-out>
									<CSSTransition classNames='slide-fade-up' timeout={200} key={cardMonth}>
										<span>{!cardMonth ? 'MM' : cardMonth} </span>
									</CSSTransition>
								</SwitchTransition>
							</label>
							/
							<label htmlFor='cardYear' className='card-item__dateItem'>
								<SwitchTransition out-in>
									<CSSTransition classNames='slide-fade-up' timeout={250} key={cardYear}>
										<span>{!cardYear ? 'YY' : cardYear.toString().substr(-2)}</span>
									</CSSTransition>
								</SwitchTransition>
							</label>
						</div>
					</div>
				</div>
			</div>

			<div className='card-item__side -back'>
				<div className='card-item__cover'>
					<img alt='' src={`/card-background/13.jpeg`} className='card-item__bg' />
				</div>
				<div className='card-item__band' />
				<div className='card-item__cvv'>
					<div className='card-item__cvvTitle'>CVV</div>
					<div className='card-item__cvvBand'>
						<TransitionGroup>
							{cardCvv.split('').map((val, index) => (
								<CSSTransition classNames='zoom-in-out' key={index} timeout={250}>
									<span>*</span>
								</CSSTransition>
							))}
						</TransitionGroup>
					</div>
					<div className='card-item__type'>
						<img alt='card-type' src={'/card-type/visa.png'} className='card-item__typeImg' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Card;
