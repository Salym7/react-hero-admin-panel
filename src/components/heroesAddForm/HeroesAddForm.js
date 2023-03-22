import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store';

import { selectAll } from '../heroesFilters/filtersSlice';
import { useCreateHeroMutation } from '../../api/apiSlice';


const HeroesAddForm = () => {
    const [createHero] = useCreateHeroMutation();
    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }


    return (
        <Formik
            initialValues={{
                name: '',
                text: '',
                description: '',
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .min(3, 'Минимум 3 символа!')
                    .required('Обезательно'),
                description: Yup.string()
                    .min(10, 'field cannot be less 10')
                    .required('Обезательно'),
                element: Yup.string().required('Choose element!'),
            })}
            onSubmit={(values, {resetForm}) => {
                createHero({...values, id:uuidv4()}).unwrap()
                resetForm();
            }}>
            <Form className="form border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field className="form-control" id="name" name="name" type="text" placeholder="Как меня зовут?"/>
                    <ErrorMessage className='error' name='name' component='div'/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label fs-4">Описание</label>
                    <Field id="description" name="description" as='textarea' className="form-control" placeholder="Что я умею?"
                           style={{"height": '130px'}}/>
                    <ErrorMessage className='error' name='description' component='div'/>
                </div>
                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field
                        className="form-select"
                        id="element"
                        name="element"
                        as='select'>
                        <option value=" ">Я владею элементом...</option>
                        {renderFilters(filters, filtersLoadingStatus)}
                    </Field>
                    <ErrorMessage className='error' name='element' component='div'/>
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;

