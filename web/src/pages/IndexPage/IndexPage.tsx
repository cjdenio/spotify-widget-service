import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  Badge,
  Box,
  Button,
  Code,
  Container,
  Flex,
  Heading,
  Link,
  Spinner,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@apollo/client'
import React from 'react'
import { RiExternalLinkLine, RiHeadphoneLine } from 'react-icons/ri'

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
  const { data } = useQuery(
    gql`
      {
        viewer {
          widget {
            isPlaying
            song
            artist
          }
        }
      }
    `,
    { pollInterval: 30000 }
  )
  const [shuffleToken] = useMutation(gql`
    mutation {
      shuffleWidgetToken
    }
  `)

  return (
    <>
      <Container mt={10}>
        <Flex justify="space-between" align="center" mb={3} px={2}>
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

        {data?.viewer?.widget?.isPlaying && (
          <Alert mb={10} variant="left-accent">
            <Flex px={2} alignItems="center">
              <RiHeadphoneLine style={{ marginRight: '10px' }} size={20} />
              <Text>
                Listening to{' '}
                <Link
                  href={data.viewer.widget.songLink}
                  color="blue.500"
                  fontWeight="bold"
                >
                  {data.viewer.widget.song}
                </Link>{' '}
                by{' '}
                <Text fontWeight="bold" display="inline">
                  {data.viewer.widget.artist}
                </Text>
              </Text>
            </Flex>
          </Alert>
        )}

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
              <Text fontWeight="bold">Coming soon!</Text>
              <Code textDecoration="line-through">{`<iframe src="${process.env.HOST}/widget?token=${user.widgetToken}" />`}</Code>
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
              <Text fontWeight="bold">Coming soon!</Text>
              <Code textDecoration="line-through">{`${process.env.HOST}/api/widget?token=${user.widgetToken}" />`}</Code>
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
              <Box mb={2}>
                <Link href={`/api/graphql`}>
                  {process.env.HOST}/api/graphql
                </Link>
              </Box>
              <Code display="block" whiteSpace="pre" p={1}>{`{
  widget(token: "${user.widgetToken}") {
    isPlaying
    song
    songLink
    artist
  }
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
          (window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=user-read-email%20user-read-playback-state`)
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
