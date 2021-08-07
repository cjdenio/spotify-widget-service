import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Code,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@redwoodjs/web'
import React from 'react'

import { FiArrowRight } from 'react-icons/fi'

const LoggedIn = ({
  user,
  refetch,
}: {
  user: {
    name: string | undefined
    email: string
    widgetToken: string
    widget: { isPlaying: boolean; song: string }
  }
  refetch: () => unknown
}) => {
  const [shuffleToken] = useMutation(gql`
    mutation {
      shuffleWidgetToken
    }
  `)
  return (
    <>
      <Container mt={10}>
        <Flex justify="space-between" align="center" mb={10} px={2}>
          <Text>
            <Text fontWeight="bold" as="span">
              Logged in as
            </Text>{' '}
            <Text decoration="underline" as="span">
              {user.name}
            </Text>{' '}
          </Text>

          <Button
            onClick={() => {
              document.cookie = 'token='
              refetch()
            }}
          >
            Log out
          </Button>
        </Flex>

        <Heading mb={5} size="md" textAlign="center">
          Get your widget up and running
        </Heading>

        <Accordion allowMultiple allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  iframe <Badge colorScheme="green">Easy</Badge>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Code>{`<iframe src="https://calebden.io/widget?code=${user.widgetToken}" />`}</Code>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  REST API <Badge colorScheme="red">Advanced</Badge>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  GraphQL API <Badge colorScheme="red">Advanced</Badge>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Code>{`{
                hi
              }`}</Code>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Text px={2} mt={3} color="gray.500">
          Your widget code is{' '}
          <Text as="span" fontWeight="bold">
            {user.widgetToken}
          </Text>
          <Tooltip
            label="This will break any existing widgets"
            placement="bottom"
          >
            <Button
              ml={5}
              variant="link"
              colorScheme="red"
              onClick={async () => {
                await shuffleToken()
                refetch()
              }}
            >
              Shuffle
            </Button>
          </Tooltip>
        </Text>
      </Container>
    </>
  )
}

const LoggedOut = () => {
  return (
    <Container mt={20} textAlign="center" maxW="container.lg">
      <Heading mb={15}>
        Embed Spotify on your personal website{' '}
        <Badge fontSize="xl" colorScheme="blue">
          Beta
        </Badge>
      </Heading>
      <Button
        colorScheme="blue"
        size="lg"
        onClick={() =>
          (window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:8910/api/oauthCallback&scope=user-read-email%20user-read-playback-state`)
        }
        rightIcon={<FiArrowRight />}
      >
        Get started
      </Button>
    </Container>
  )
}

const IndexPage = () => {
  const { loading, data, refetch } = useQuery(gql`
    {
      viewer {
        name
        email
        widgetToken
      }
    }
  `)

  if (loading) return <Spinner />

  return data?.viewer ? (
    <LoggedIn
      user={data.viewer}
      refetch={() => {
        console.log('test')

        refetch()
      }}
    />
  ) : (
    <LoggedOut />
  )
}

export default IndexPage
