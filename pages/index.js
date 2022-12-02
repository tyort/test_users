import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { Component, createRef, useEffect, useState } from 'react'
import { Input, Menu, Card, Icon, Checkbox } from 'semantic-ui-react'

function Home({users}) {
  const formRef = createRef();
  const [modifiedCheckboxes, setModifiedCheckboxes] = useState([]);
  const [isMarkedShowOnly, setMarkedShowOnly] = useState(true);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <form ref={formRef} onSubmit={(evt) => {
          evt.preventDefault();
          formRef.current.reset();
        }}>
          <label htmlFor="user-name">Введите имя полностью или частично</label>
          <input style={{marginLeft: '0.5em'}} name="user-name"/>
          <button style={{marginLeft: '3em'}} type="submit">Фильтровать</button>
          <div className='page-user-sorting'>
            <Checkbox onChange={(evt, data) => setMarkedShowOnly(!data.checked)} style={{marginTop: '2em'}} label='Показать только отмеченные' />
          </div>
        </form>
        <section className='page-user-cards'>
          <ul className='page-user-cards__list'>
            {
              users.map(({isVisible, id, fullName, birthYear, profession, friendsCount}) => {
                return (
                  isVisible && <li key={id}>
                    <Checkbox
                      id={id}
                      onChange={(event, data) => {
                        setModifiedCheckboxes([...modifiedCheckboxes, [data.id, data.checked]])
                      }}
                    />
                    <Card>
                      <Card.Content>
                        <Card.Header>{fullName}</Card.Header>
                        <Card.Meta>
                          <span className='date'>Born in {birthYear}</span>
                        </Card.Meta>
                        <Card.Description>
                          He(She) is {profession}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <a>
                          <Icon name='user' />
                          {friendsCount} Friends
                        </a>
                      </Card.Content>
                    </Card>
                  </li>
                )
              })
            }
          </ul>
        </section>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3002/`)
  const data = await res.json()
  console.log(data)

  return {
    props: {
      users: data
    },
  };
}

export default Home;

