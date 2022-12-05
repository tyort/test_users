import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Icon, Checkbox, Menu, Input, Button } from 'semantic-ui-react';
import { Reorder } from 'framer-motion';
import styles from '../styles/Home.module.css';

function Home() {
  const [users, setUsers] = useState([]);
  const [orderedUsers, setorderedUsers] = useState(users);
  const [currentCount, setCurrentCount] = useState(8);
  const [fetching, setFetching] = useState(true); // true- подгружаем данные

  useEffect(() => {
    setorderedUsers(users);
  }, [users]);

  useEffect(() => {
    axios.post(`http://localhost:3002`, orderedUsers).catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  }, [orderedUsers]);

  useEffect(() => {
    if (fetching) {
      axios
        .all([axios.get(`http://localhost:3002/?limit=${currentCount}`)])
        .then(
          axios.spread((res2) => {
            setUsers(res2.data);
            setCurrentCount((prevState) => prevState + 1);
          })
        )
        .finally(() => setFetching(false));
    }
  }, [fetching]);

  const scrollhandler = (evt) => {
    if (
      evt.target.documentElement.scrollHeight -
        evt.target.documentElement.scrollTop -
        window.innerHeight <
      100
    ) {
      setFetching(true);
    }
    // console.log(evt.target.documentElement.scrollHeight); // общая высота страницы с учетом скролла
    // console.log(evt.target.documentElement.scrollTop); // текущее положение скролла
    // console.log(window.innerHeight); // высота видимой области страницы
  };

  useEffect(() => {
    document.addEventListener('scroll', scrollhandler);
    // eslint-disable-next-line func-names
    return function () {
      document.removeEventListener('scroll', scrollhandler);
    };
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Menu secondary>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Input icon='search' placeholder='Введите имя' />
            </Menu.Item>
            <Menu.Item>
              <Button>Поиск пользователей</Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Checkbox
          style={{ marginTop: '2em' }}
          label='Показать только отмеченные'
        />
        <section className='page-user-cards'>
          <Reorder.Group
            className='page-user-cards__list'
            axys='y'
            values={orderedUsers}
            onReorder={setorderedUsers}
          >
            {orderedUsers.map((user) => {
              if (user === null) {
                return '';
              }
              const {
                isVisible,
                id,
                isChecked,
                fullName,
                birthYear,
                profession,
                friendsCount,
              } = user;
              return (
                isVisible && (
                  <Reorder.Item value={user} key={id}>
                    <Checkbox defaultChecked={isChecked} id={id} />
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
                  </Reorder.Item>
                )
              );
            })}
          </Reorder.Group>
        </section>
      </main>
    </div>
  );
}

export default Home;
