
import datetime
import telebot from "telebot"
from telebot import types

# Создание объекта бота
bot = telebot.TeleBot(process.env.TELEGRAM_BOT_TOKEN)

# Функция для создания меню с выбором типа еды (завтрак, обед, ужин)
def get_food_menu():
    markup = types.InlineKeyboardMarkup(row_width=3)
    breakfast_button = types.InlineKeyboardButton("Завтракать 🍳", callback_data='завтракать')
    lunch_button = types.InlineKeyboardButton("Обедать 🍔", callback_data='обедать')
    dinner_button = types.InlineKeyboardButton("Ужинать 🍲", callback_data='ужинать')
    markup.add(breakfast_button, lunch_button, dinner_button)
    return markup

# Обработчик команды /start
@bot.message_handler(commands=['start'])
def start_command(message: types.Message):
    # Отправляем приветственное сообщение
    bot.send_message(message.chat.id, "Приветик, солнышко, выбери пункт, что ты сейчас будеф делать!",
                     reply_markup=get_food_menu())

# Обработчик нажатия на кнопки с выбором типа еды (завтрак, обед, ужин)
@bot.callback_query_handler(lambda query: query.data in ['завтракать', 'обедать', 'ужинать'])
def process_food_type(callback_query: types.CallbackQuery):
    food_type = callback_query.data
    bot.answer_callback_query(callback_query.id)
    bot.send_message(callback_query.from_user.id, f"Ты выбрала {food_type}. Теперь напиши фто мой котенок будет куфать:")

# Обработчик текстовых сообщений с заказом еды
@bot.message_handler(func=lambda message: True)
def process_food_order(message: types.Message):
    # Проверяем, является ли сообщение названием еды
    order_text = message.text.strip()

    if order_text:
        # Форматируем текущую дату и время
        now = datetime.datetime.now().strftime("%d-%m %H:%M")
        # Отправляем сообщение с подтверждением заказа и временем отправки
        bot.send_message(message.chat.id, f"То что ты покушала, а именно '{order_text}'  было отправлено твоему мальчику в {now}",
                         reply_markup=types.ReplyKeyboardRemove())
        # Отправляем уведомление другому пользователю о новом заказе и времени отправки
        bot.send_message(chat_id='963433317', text=f"Зайка ({message.from_user.full_name}) поела {order_text} в {now}")

# Обработчик ошибок
@bot.errorhandler(Exception)
def error_handler(exception):
    print(f"Exception: {exception}")
    bot.reply_to(message, "Произошла ошибка, попробуйте еще раз")

# Запускаем бота
if __name__ == '__main__':
    bot.polling()
export default bot
