import React from 'react'
import { CampaignWrapper, CampaignInner, CampaignTextWrap } from './styles'

interface CampaignDisplayProps {
  exit: () => void
}

export const CampaignDisplay: React.FC<CampaignDisplayProps> = ({ exit }) => (
  <CampaignWrapper>
    <CampaignTextWrap>
      <p>Thanks for listening!</p>
      <p>WFMU is completely listener supported, so please consider giving a donation by clicking the PLEDGE NOW button.</p>
      <p>Or visit <a target="_blank" href="https://pledge.wfmu.org">pledge.wfmu.org</a></p>
      <p>... or <a href='#' onClick={exit}>click here</a> to go back to listening</p>
    </CampaignTextWrap>
    <CampaignInner>
      <iframe src="https://pledge.wfmu.org/pledge-widget" frameBorder="0"></iframe>
    </CampaignInner>
  </CampaignWrapper>
)
