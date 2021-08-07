export const schema = gql`
  type User {
    id: Int!
    email: String!
    name: String!
    widgetToken: String!

    widget: Widget!
  }

  type Query {
    viewer: User
  }

  type Mutation {
    shuffleWidgetToken: String
  }
`
