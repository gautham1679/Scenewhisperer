from gtts import gTTS

def text_to_speech(text):
    from gtts import gTTS
    audio_path="report_audio_mp3"
    tts=gTTS(text)
    tts.save(audio_path)
    return audio_path