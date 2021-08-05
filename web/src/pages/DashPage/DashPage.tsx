import { Link, routes } from '@redwoodjs/router'

const DashPage = () => {
  return (
    <>
      <h1>DashPage</h1>
      <p>
        Find me in <code>./web/src/pages/DashPage/DashPage.tsx</code>
      </p>
      <p>
        My default route is named <code>/dash</code>, link to me with `
        <Link to={routes.dash()}>Dash</Link>`
      </p>
    </>
  )
}

export default DashPage
