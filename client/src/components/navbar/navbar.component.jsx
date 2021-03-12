import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../container/container.component'
import Logo from '../../assets/logo_bwfix.svg'
import NavbarTogle from './navbar.togle'


import NavbarList from './navbar.list'

const Navbar = () => {
  const [active, setActive] = useState()

  const menuState = () => {
    setActive(!active)
  }

    return (
      <Container>
        <nav className="navbar">
          {/* Left side */}
          <div className="flex justify-between w-full md:w-32 items-center">
            <Link to='/' className='logo w-16 animate'>
              <img src={Logo} alt='Main Logo'/>
            </Link>
            <NavbarTogle active={active} menuState={menuState} />
          </div>

          {/* Right side */}
          <div className={`${active ? 'flex' : 'hidden'} md:flex`}>
            <NavbarList />
          </div>
        </nav>
      </Container>
    )
}


export default Navbar