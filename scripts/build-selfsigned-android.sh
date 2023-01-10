cd android/app
keytool -genkeypair -v -keystore gh-actions.keystore -alias gh-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass 1234ab  -keypass 1234ab -noprompt -dname "CN=woffee, OU=ID, O=Woffee, L=Espinosa, S=Pablo, C=GB"
cd ..
echo -e "MYAPP_UPLOAD_STORE_FILE=gh-actions.keystore\nMYAPP_UPLOAD_KEY_ALIAS=gh-alias\nMYAPP_UPLOAD_STORE_PASSWORD=1234ab\nMYAPP_UPLOAD_KEY_PASSWORD=1234ab\n" >> gradle.properties
#./gradlew bundleRelease
./gradlew assembleRelease
