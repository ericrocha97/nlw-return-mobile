import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View, Text, Image } from "react-native";
import { ArrowLeft } from "phosphor-react-native";
import * as FileSystem from "expo-file-system";

import { styles } from "./styles";
import { theme } from "../../theme";
import { FeedbackType } from "../Widget";
import { feedbackTypes } from "../../utils/feedbackTypes";
import { ScreenshotButton } from "../ScreenshotButton";
import { Button } from "../Button";
import { captureScreen } from "react-native-view-shot";
import { Copyright } from "../Copyright";
import { api } from "../../libs/api";

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent,
}: Props) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotIsLoading, setScreenshotIsLoading] = useState(false);
  const [isSendFeedback, setIsSendFeedback] = useState(false);
  const [comment, setComment] = useState("");
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] = useState(true);

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  useEffect(() => {
    setIsDisabledSubmitButton(comment.length < 5);
  }, [comment]);

  function handleScreenshot() {
    setScreenshotIsLoading(true);
    captureScreen({
      format: "png",
      quality: 0.8,
    })
      .then((uri) => {
        setScreenshot(uri);
        setScreenshotIsLoading(false);
      })
      .catch((error) => console.log(error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isSendFeedback) {
      return;
    }
    setIsSendFeedback(true);

    const screenshotBase64 =
      screenshot &&
      (await FileSystem.readAsStringAsync(screenshot, { encoding: "base64" }));

    const screenshotContent = screenshot
      ? `data:image/png;base64,${screenshotBase64}`
      : null;

    try {
      await api.post("/feedbacks", {
        type: feedbackType,
        screenshot: screenshotContent,
        comment,
      });

      onFeedbackSent();
    } catch (error) {
      console.log(error);
      setIsSendFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />
          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder={feedbackTypeInfo.placeHolder}
        placeholderTextColor={theme.colors.text_secondary}
        onChangeText={setComment}
        value={comment}
      />
      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
          isLoading={screenshotIsLoading}
        />
        <Button
          isLoading={isSendFeedback}
          onPress={handleSendFeedback}
          isDisabled={isDisabledSubmitButton}
          disabled={isDisabledSubmitButton}
        />
      </View>
      <Copyright />
    </View>
  );
}
