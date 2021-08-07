export const schema = gql`
  type Widget {
    isPlaying: Boolean!

    song: String
    songLink: String
    artist: String
  }

  type Query {
    widget(token: String!): Widget
  }
`
