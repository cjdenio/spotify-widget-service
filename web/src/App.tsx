import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider>
      <RedwoodApolloProvider>
        <ChakraProvider
          theme={extendTheme({ config: { initialColorMode: 'light' } })}
        >
          <Routes />
        </ChakraProvider>
      </RedwoodApolloProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
