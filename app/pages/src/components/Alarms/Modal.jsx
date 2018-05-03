import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Image, Modal } from 'semantic-ui-react';
import { alarmsInfo, playSoundSrc, stopSound } from '../Alarms/alarms';
import css from './styles.css';

const SnoozeButton = ({ snooze, text }) => <Button color="black" onClick={() => snooze()} content={text} />;

@inject('alarmsStore')
@observer
class AlarmModal extends Component {
    componentDidUpdate() {
        const { alarmsStore } = this.props;
        if (alarmsStore.activeAlarm) {
            this.play(0);
        }
    }

    play(i) {
        const { activeAlarm } = this.props.alarmsStore;
        const { sounds, interval } = alarmsInfo.find(j => j.voice === activeAlarm.voice);
        playSoundSrc(sounds[i % sounds.length]);
        setTimeout(() => {
            const alarm = this.props.alarmsStore.activeAlarm;
            if (alarm && alarm.voice === activeAlarm.voice) {
                this.play(i + 1);
            }
        }, interval);
    }

    close() {
        stopSound();
        this.props.alarmsStore.removeActiveAlarm();
    }

    snooze(minutes) {
        stopSound();
        this.props.alarmsStore.snooze(minutes);
    }

    render() {
        const { activeAlarm } = this.props.alarmsStore;
        const alarm = activeAlarm ? alarmsInfo.find(i => i.voice === activeAlarm.voice) : null;

        return (
            <div>
                <Modal
                    dimmer
                    open={!!activeAlarm}
                    closeOnEscape={false}
                    closeOnRootNodeClick={false}
                    size="tiny"
                >
                    <Modal.Header style={{ padding: '10px 0', 'text-align': 'center' }}>
                        {`${alarm ? alarm.name : null} пытается разбудить вас!`}
                    </Modal.Header>
                    <Modal.Content image style={{ display: 'block' }}>
                        <Image style={{ margin: 'auto' }} fluid size="medium" src={alarm ? alarm.img : null} />
                    </Modal.Content>
                    <Modal.Actions className={css.modal_actions}>
                        <SnoozeButton snooze={() => this.snooze(5)} text="Еще 5 минуточек..." />
                        <Button positive content="Просыпаюсь!" onClick={() => this.close()} />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default AlarmModal;
