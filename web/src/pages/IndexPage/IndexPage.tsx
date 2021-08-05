import { Button, Link } from '@chakra-ui/react'
import { RiLoginCircleFill, RiLoginBoxLine } from 'react-icons/ri'

const IndexPage = () => {
  return (
    <>
      <Link
        href={`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:8910/.redwood/functions/oauthCallback&scope=user-read-email%20user-read-playback-state`}
      >
        <Button leftIcon={<RiLoginCircleFill />}>Log in</Button>
      </Link>
    </>
  )
}

export default IndexPage
