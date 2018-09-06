import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import li from 'lorem-ipsum';
import 'intersection-observer';

const Horizontal = styled.div`
  display: flex;
`;

const Navigation = styled.nav`
  margin: 30px;
`;

const Article = styled.div`
  overflow-y: scroll;
  height: 100vh;
`;

const Anchor = styled.a`
  display: block;
  margin-bottom: 10px;
  text-decoration: none;

  ${props =>
    props.selected
      ? css`
          border-bottom: 1px solid #000;
          font-weight: bold;
        `
      : null};
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      things: [
        {
          id: 'a',
          headline: 'React',
          text: li({ count: 50, units: 'sentences' }),
        },
        {
          id: 'b',
          headline: 'Redux',
          text: li({ count: 50, units: 'sentences' }),
        },
        {
          id: 'c',
          headline: 'GraphQL',
          text: li({ count: 50, units: 'sentences' }),
        },
      ],
      activeThing: { id: null, ratio: 0 },
    };

    this.rootRef = React.createRef();

    this.singleRefs = this.state.things.reduce((acc, value) => {
      acc[value.id] = {
        ref: React.createRef(),
        id: value.id,
        ratio: 0,
      };

      return acc;
    }, {});

    const callback = entries => {
      entries.forEach(
        entry =>
          (this.singleRefs[entry.target.id].ratio =
            entry.intersectionRatio),
      );

      const activeThing = Object.values(this.singleRefs).reduce(
        (acc, value) => (value.ratio > acc.ratio ? value : acc),
        this.state.activeThing,
      );

      if (activeThing.ratio > this.state.activeThing.ratio) {
        this.setState({ activeThing });
      }
    };

    this.observer = new IntersectionObserver(callback, {
      root: this.rootRef.current,
      threshold: new Array(101).fill(0).map((v, i) => i * 0.01),
    });
  }

  componentDidMount() {
    Object.values(this.singleRefs).forEach(value =>
      this.observer.observe(value.ref.current),
    );
  }

  render() {
    return (
      <Horizontal>
        <Navigation>
          {this.state.things.map(thing => (
            <div key={thing.id}>
              <Anchor
                href={`#${thing.id}`}
                selected={thing.id === this.state.activeThing.id}
              >
                {thing.headline}
              </Anchor>
            </div>
          ))}
        </Navigation>

        <Article ref={this.rootRef}>
          {this.state.things.map(thing => (
            <div
              key={thing.id}
              id={thing.id}
              ref={this.singleRefs[thing.id].ref}
            >
              <h1>{thing.headline}</h1>
              <p>{thing.text}</p>
            </div>
          ))}
        </Article>
      </Horizontal>
    );
  }
}

export default App;
