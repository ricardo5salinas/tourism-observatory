import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChatBubble, cilSend, cilX, cilSearch, cilExternalLink } from '@coreui/icons'
import { helpSuggestions } from '../data/userManual'
import { buildManualAnswer } from '../utils/manualSearch'

const initialMessages = [
  {
    id: 'welcome',
    role: 'bot',
    text: 'Hola. Soy el asistente de ayuda del observatorio. Preguntame sobre usuarios, publicaciones, documentos, nucleos, autores o perfil.',
    matches: [],
  },
]

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

const HelpChatbot = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState(initialMessages)

  const lastBotMatches = useMemo(() => {
    const lastBotMessage = [...messages].reverse().find((message) => message.role === 'bot')
    return lastBotMessage?.matches || []
  }, [messages])

  const sendQuestion = (question = query) => {
    const cleanQuestion = question.trim()

    if (!cleanQuestion) return

    const answer = buildManualAnswer(cleanQuestion)

    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: 'user',
        text: cleanQuestion,
      },
      {
        id: createMessageId(),
        role: 'bot',
        text: answer.text,
        matches: answer.matches,
      },
    ])
    setQuery('')
    setOpen(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendQuestion()
  }

  const goToRoute = (route) => {
    navigate(route)
    setOpen(false)
  }

  return (
    <div className="help-chatbot" aria-live="polite">
      {open ? (
        <div className="help-chatbot-panel">
          <div className="help-chatbot-header">
            <div>
              <strong>Asistente de ayuda</strong>
              <span>Manual de usuario</span>
            </div>
            <CButton
              color="transparent"
              size="sm"
              className="help-chatbot-icon"
              title="Cerrar ayuda"
              onClick={() => setOpen(false)}
            >
              <CIcon icon={cilX} />
            </CButton>
          </div>

          <div className="help-chatbot-body">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`help-chatbot-message help-chatbot-message-${message.role}`}
              >
                <p>{message.text}</p>
                {message.matches?.length ? (
                  <CListGroup flush className="help-chatbot-results">
                    {message.matches.map((match) => (
                      <CListGroupItem key={match.id}>
                        <div className="help-chatbot-result-title">{match.title}</div>
                        <ol>
                          {match.steps.slice(0, 3).map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                        {match.route ? (
                          <CButton
                            size="sm"
                            color="link"
                            className="p-0"
                            onClick={() => goToRoute(match.route)}
                          >
                            <CIcon icon={cilExternalLink} className="me-1" />
                            Abrir modulo
                          </CButton>
                        ) : null}
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                ) : null}
              </div>
            ))}
          </div>

          <div className="help-chatbot-suggestions">
            {helpSuggestions.map((suggestion) => (
              <CButton
                key={suggestion}
                color="light"
                size="sm"
                onClick={() => sendQuestion(suggestion)}
              >
                {suggestion}
              </CButton>
            ))}
          </div>

          <form className="help-chatbot-form" onSubmit={handleSubmit}>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilSearch} />
              </CInputGroupText>
              <CFormInput
                value={query}
                placeholder="Escribe tu pregunta"
                onChange={(event) => setQuery(event.target.value)}
              />
              <CButton color="primary" type="submit" title="Enviar pregunta">
                <CIcon icon={cilSend} />
              </CButton>
            </CInputGroup>
          </form>
        </div>
      ) : (
        <CButton
          color="primary"
          className="help-chatbot-launcher"
          title="Abrir asistente de ayuda"
          onClick={() => setOpen(true)}
        >
          <CIcon icon={cilChatBubble} />
          {lastBotMatches.length ? <span>{lastBotMatches.length}</span> : null}
        </CButton>
      )}
    </div>
  )
}

export default HelpChatbot
