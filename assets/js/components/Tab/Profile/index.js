import React, { Component } from 'react'
import { Col, Row, Form, Button } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import HelTextInput from '../../HelTextInput'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'

import {
  fetchUserData,
  updateUserData,
  deleteUserProfile
} from '../../../user/redux'
import ImgDropAndCrop from '../../ImgDropAndCrop'
import DownloadOwnData from '../../DownloadOwnData'

class Profile extends Component {
  componentDidMount() {
    this.props.fetchUserData()
  }

  setNickname = debounce(nickname => {
    this.props.updateUserData({ nickname })
  }, 750)

  selectImage(imgBlob) {
    const formData = new FormData()
    formData.set('image', imgBlob, `${Date.now()}.png`)
    this.props.updateUserData(formData)
  }

  unselectImage() {
    this.props.updateUserData({ image: null })
  }

  deleteProfile = () => {
    const msg = this.props.intl.formatMessage({
      id: 'app.profile.delete.confirm'
    })
    if (confirm(msg)) {
      this.props.deleteUserProfile()
    }
  }

  render() {
    const { intl, tunnistamoUser, user } = this.props
    const hasImage = Boolean(user.image)
    return (
      <div className="profile-view">
        <section>
          <Row>
            <Col xs={12}>
              <h1>
                <FormattedMessage id="app.profile" />
              </h1>
              <p className="lead">
                <FormattedMessage id="app.profile.edit" />
              </p>
            </Col>
          </Row>
        </section>
        <section>
          <Row className="section">
            <Col xs={12}>
              <h2>
                <FormattedMessage id="app.basicInfo" />
              </h2>
              <p className="lead text-muted">
                <FormattedMessage id="app.not.public" />
              </p>
            </Col>
          </Row>
          <Form className="form-basic-information">
            <Row>
              <Col xs={12}>
                <strong>
                  {intl.formatMessage({ id: 'profile.firstName' })}
                </strong>{' '}
                <span>{tunnistamoUser.first_name}</span>
              </Col>
              <Col xs={12}>
                <strong>
                  {intl.formatMessage({ id: 'profile.lastName' })}
                </strong>{' '}
                <span>{tunnistamoUser.last_name}</span>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <strong>{intl.formatMessage({ id: 'profile.email' })}</strong>{' '}
                <span>{tunnistamoUser.email}</span>
              </Col>
            </Row>
          </Form>
        </section>
        <section>
          <Row>
            <Col xs={12}>
              <h2>
                <FormattedMessage id="app.profileInformation" />
              </h2>
              <p className="lead text-muted">
                <FormattedMessage id="app.profileInformation.text" />
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6}>
              <div className="profile-picture">
                <h5>
                  <FormattedMessage id="app.profile.picture" />
                </h5>
                {hasImage ? (
                  <div>
                    <div className="profile-picture__picture">
                      <img src={user.image} alt="profile" />
                    </div>
                    <Button color="danger" onClick={() => this.unselectImage()}>
                      <FormattedMessage id="app.profile.picture.delete" />
                    </Button>
                  </div>
                ) : (
                  <div className="profile-image-upload">
                    <div className="profile-image-upload__picture">
                      <ImgDropAndCrop
                        getCroppedImage={img => this.selectImage(img)}
                      />
                    </div>
                    <div className="profile-image-upload__help">
                      <small className="text-muted">
                        <FormattedMessage id="app.profile.picture.limit" />
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <HelTextInput
                id="nickname"
                defaultValue={user.nickname}
                type="text"
                required={true}
                onChange={e => this.setNickname(e.target.value)}
                label={intl.formatMessage({ id: 'app.profile.nickname' })}
                helpText={intl.formatMessage({
                  id: 'app.profile.nickname.text'
                })}
              />
            </Col>
          </Row>
        </section>
        <section>
          <DownloadOwnData />
          <Button color="danger" onClick={() => this.deleteProfile()}>
            <FormattedMessage id="app.profile.delete" />
          </Button>
        </section>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  tunnistamoUser: state.userReducer.tunnistamoUser
})
export default connect(
  mapStateToProps,
  { fetchUserData, updateUserData, deleteUserProfile }
)(injectIntl(Profile))
