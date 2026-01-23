export interface FaqDTO{
    preguntas: PreguntaDTO[];
}

export interface PreguntaDTO{
    id: number;
    pregunta: string;
    respuesta: string;
}

export const mockFaqs: FaqDTO = {
    preguntas: [
        {id: 1, pregunta: 'Cual es la pregunta 1?', respuesta: 'Esta es la respuesta de la pregunta 1' },
        {id: 2, pregunta: 'Cual es la pregunta 2?', respuesta: 'Esta es la respuesta de la pregunta 2' }
      ]
};
