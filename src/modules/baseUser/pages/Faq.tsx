import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Fab,
  Link,
  Typography,
} from '@mui/material'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useAuth } from '../../auth/contexts/AuthProvider'
import BaseAppBar from '../components/BaseAppBar'
import BaseToolbar from '../components/BaseToolbar'
import { accessType, authorization } from '../config/authorization'
import { FAQ_ROUTE, HELP_ROUTE, ROOT_ROUTE } from '../constants/routes'

const Faq = (): JSX.Element => {
  const { userInfo } = useAuth()
  const { t } = useTranslation()
  const [questions, setQuestions] = useState<any>(undefined)

  useEffect(() => {
    // Read the translation file to find faq structure
    fetch('/faq/questions.json')
      .then((response) => {
        return response?.json()
      })
      .then((data) => {
        setQuestions(data?.questions)
      })
      .catch((err) => {
        console.error('Error Reading data ', err)
        setQuestions(undefined)
      })
  }, [])

  return (
    <React.Fragment>
      <BaseAppBar>
        <BaseToolbar title={t('users:userManagement.toolbar.title')}>
          <Fab
            aria-label="back-institutionalization-organization"
            color="secondary"
            // disabled={processing}
            size="small"
            href={`${ROOT_ROUTE}/${HELP_ROUTE}`}
          >
            <ArrowBackIcon />
          </Fab>
        </BaseToolbar>
      </BaseAppBar>
      <Container maxWidth="md">
        <Typography align="center" marginBottom={6} variant="h2">
          {t('faq:title')}
        </Typography>
        {questions &&
          questions.map((faqQuestion: any, index: number) => {
            return (
              lodash.includes(faqQuestion.role, userInfo.role) && (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography component="p" variant="h6">
                      {t(faqQuestion.question.title)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">
                      {t(faqQuestion.answer)}
                    </Typography>
                    {faqQuestion?.resource?.video && (
                      <iframe
                        width="100%"
                        height="300"
                        src={t(faqQuestion?.resource?.video?.src)}
                        title={t(faqQuestion?.resource?.video?.title)}
                        allowFullScreen
                        style={{ marginTop: 36 }}
                      />
                    )}
                    {faqQuestion?.resource?.link && (
                      <div style={{ marginTop: 36 }}>
                        <a
                          href={t(faqQuestion?.resource?.link?.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t(
                            faqQuestion?.resource?.link?.text ??
                              faqQuestion?.resource?.link?.location
                          )}
                        </a>
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              )
            )
          })}
        {/* <Link
          component={RouterLink}
          to={`/${ROOT_ROUTE}/${HELP_ROUTE}`}
          variant="body2"
        >
          {t('faq.noAnswerLink')}
        </Link> */}
      </Container>
    </React.Fragment>
  )
}

export default Faq
