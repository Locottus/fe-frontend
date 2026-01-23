import { FaqDTO, PreguntaDTO, mockFaqs } from './faq.dto';

describe('FAQ DTOs', () => {
  describe('mockFaqs', () => {
    it('should be defined', () => {
      expect(mockFaqs).toBeDefined();
    });

    it('should have preguntas array', () => {
      expect(mockFaqs.preguntas).toBeDefined();
      expect(Array.isArray(mockFaqs.preguntas)).toBeTruthy();
    });

    it('should have 2 preguntas', () => {
      expect(mockFaqs.preguntas.length).toBe(2);
    });

    it('each pregunta should have id, pregunta and respuesta', () => {
      mockFaqs.preguntas.forEach((pregunta: PreguntaDTO) => {
        expect(pregunta.id).toBeDefined();
        expect(pregunta.pregunta).toBeDefined();
        expect(pregunta.respuesta).toBeDefined();
      });
    });
  });

  describe('FaqDTO interface', () => {
    it('should accept valid FaqDTO object', () => {
      const faq: FaqDTO = {
        preguntas: [
          { id: 1, pregunta: 'test', respuesta: 'test answer' }
        ]
      };
      expect(faq).toBeDefined();
    });
  });

  describe('PreguntaDTO interface', () => {
    it('should accept valid PreguntaDTO object', () => {
      const pregunta: PreguntaDTO = {
        id: 1,
        pregunta: 'test question',
        respuesta: 'test answer'
      };
      expect(pregunta).toBeDefined();
    });
  });
});
