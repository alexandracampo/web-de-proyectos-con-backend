import Profile from './Profile';
import cover from '../images/cover.jpeg';
import user from '../images/user.png';
import { useLocation, matchPath, NavLink } from 'react-router-dom';
import ls from '../services/localStorage'
import { useState } from 'react';


const DetailCard = () => {
  const [dataDetail, setDataDetail] = useState(ls.get('cardList', []));



  const { pathname } = useLocation();
  const routeData = matchPath('/detailcard/:id', pathname);
  const cardId = routeData !== null ? routeData.params.id : '';


  // NOS QUEDAMOS POR AQUÍ
  const cardFound = dataDetail.find((card) => card.id_project === parseInt(cardId));

  if (cardFound !== undefined) {

    return (
      <main >
        <section className='section_buttons'>
          <NavLink className='btn--project' to='/'><i className="detail__link fa-sharp fa-solid fa-arrow-left"></i>Volver</NavLink>
          <NavLink className="btn--project" to="/create">Nuevo proyecto</NavLink>
        </section>


        <section className='detail--autor'>
          <section className='info--project'>
            <div className='wrap--title__preview'>
              <div className='info--project__line1'></div>
              <p className='info--project__subtitle'>Personal Project Card</p>
              <div className='info--project__line2'></div>
            </div>
            <h2 className='info--project__title'>{cardFound.name || 'Elegant Workspace'}</h2>
            <p className='info--project__slogan'>{cardFound.slogan || 'Diseños Exclusivos'}</p>
            <p className='info--project__desc'>{cardFound.desc || 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero, delectus? Voluptates at hic aliquam porro ad suscipitharum laboriosam saepe earum doloribus aperiam, ullam culpa accusantium placeat odit corrupti ipsum!'}</p>
            <section className='info--proyect__section'>
              <div className='info--project__technologies'>
                <p className='info--project__technologies-text'>{cardFound.technologies || 'React JS, MongoDB'}</p>
              </div>
              <div className='wrap--icon'>
                <NavLink href={cardFound.demo} target="_blank" rel="noreferrer"><i className='fa-solid fa-globe info--project__technologies-icon1'></i></NavLink>
                <NavLink href={cardFound.repo} target="_blank" rel="noreferrer"><i className='fa-brands fa-github info--project__technologies-icon1'></i></NavLink>
              </div>
            </section>
          </section>

          <section className='info--autor'>
            <Profile className='info--autor__image' defaultAvatar={user} avatar={cardFound.photo} />
            <p className='info--autor__job'>{cardFound.job || 'Full Stack Developer'}</p>
            <p className='info--autor__name'>{cardFound.autor || 'Emmelie Björklund'}</p>
          </section>
        </section>
        <section className='preview  main--detailcard'>
          <Profile className='detail--image' defaultAvatar={cover} avatar={cardFound.image} />
        </section>
      </main>
    )
  } else {
    return (
      <p>Error</p>
    )
  }

}

export default DetailCard;
