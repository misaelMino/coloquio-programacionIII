import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Image, Spin } from 'antd';
import axios from 'axios';
import './QuestionForm.css';

const { Title } = Typography;

export default function QuestionForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidQuestion = (q) => {
    return q.trim().endsWith('?') || (q.trim().startsWith('¿') && q.trim().endsWith('?'));
  };

  const handleSubmit = async () => {
    if (!isValidQuestion(question)) {
      setError('La pregunta no es válida. Usá signos de interrogación.');
      setAnswer(null);
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await axios.get('https://yesno.wtf/api');
      setAnswer(res.data);
    } catch (err) {
      setError('Error al conectar con la API.');
      setAnswer(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="question-card">
        <Title level={3} className="title">🔮Consultá tu futuro ejejj🧙</Title>

        <Form onFinish={handleSubmit}>
          <Form.Item>
            <Input
              placeholder="¿Voy a aprobar el coloquio?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Consultar
            </Button>
          </Form.Item>
        </Form>

        {error && <Alert message={error} type="error" showIcon className="alert" />}

        {loading && <Spin tip="Consultando al oráculo..." className="loading-spin" />}

        {answer && !loading && (
          <Card type="inner" className="answer-card">
            <Title level={4}>Respuesta: {answer.answer.toUpperCase()}</Title>
            <Image
              src={answer.image}
              alt="respuesta animada"
              width={250}
              preview={false}
            />
          </Card>
        )}
      </Card>
    </div>
  );
}
