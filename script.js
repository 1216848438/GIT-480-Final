"use strict";

let questions = [];

async function loadQuestions() {
  const response = await fetch('quiz.json');
  questions = await response.json();
  loadRandomQuestion();
}

function loadRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  const randomQuestion = questions[randomIndex];

  const questionElement = document.getElementById('quiz-question');
  const answersElement = document.getElementById('quiz-answers');
  
  questionElement.textContent = randomQuestion.question;
  answersElement.innerHTML = '';

  randomQuestion.answers.forEach((answer, index) => {
    const answerItem = document.createElement('li');
    answerItem.textContent = answer;
    answerItem.classList.add('answer-item');
    answerItem.addEventListener('click', () => checkAnswer(index, randomQuestion.correct));
    answersElement.appendChild(answerItem);
  });
}

  async function checkAnswer(selectedIndex, correctIndex) {
  const answerItems = document.querySelectorAll('.answer-item');
  answerItems.forEach((item, index) => {
    if (index === correctIndex) {
      item.classList.add('highlight-correct');
    } else if (index === selectedIndex) {
      item.classList.add('highlight-incorrect');
    }
  });

  const userScore = selectedIndex === correctIndex ? 1 : 0;
  await updatePoints(userScore);
  await submitUserResult(userScore);
  setTimeout(loadRandomQuestion, 2000);
}

async function updatePoints(pointsToAdd) {
  const user = auth.currentUser;
  if(user) {
    const userRef = db.collection('users').doc(user.uid);
    const increment = firebase.firestore.FieldValue.increment(pointsToAdd);
    await userRef.update({points: increment});
    const userDoc = await userRef.get();
    document.getElementById('user-points').textContent = userDoc.data().points;
  }
}

window.onload = loadQuestions;

document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', function(event) {
      event.preventDefault();
      const topic = event.target.getAttribute('data-topic');
      loadTopicContent(topic);
  });
});

function loadTopicContent(topic) {
  const content = {
      habitat: "<h2>Habitat</h2><ul><li>Snow leopards primarily inhabit the mountainous regions of Central and South Asia, including the Himalayas, the Tibetan Plateau, and parts of Mongolia and Russia. Their habitat consists of rugged terrains at elevations between 3,000 and 4,500 meters (9,800 to 14,800 feet).</li><li>Conservation efforts focus on preserving these habitats from mining, agriculture, and human encroachment, which threaten their natural environments.</li></ul>",
      threats: "<h2>Threats</h2><ul><li>Poaching: Snow leopards are often targeted for their beautiful fur and body parts, which are used in traditional medicine.</li><li>Habitat Loss: Human activities such as livestock grazing, infrastructure development, and climate change are leading to significant habitat loss.<li><li>Human-Wildlife Conflict: As human populations expand into snow leopard habitats, conflicts arise, often leading to retaliatory killings of snow leopards by herders protecting their livestock.</li></ul>",
      prey: "<h2>Prey</h2><ul><li>The primary prey of snow leopards includes mountain ungulates like ibex, blue sheep (bharal), and argali sheep. These prey species are also under threat from poaching and habitat loss.</li><li>Maintaining healthy prey populations is crucial for snow leopard conservation, as it directly affects their survival.</li>",
      "habitat-map": "<h2>Habitat Map</h2><ul><li>A habitat map illustrates the range of snow leopards, highlighting areas where their populations are stable, declining, or threatened. This map is a product of the combined efforts of Snow Leopard Conservationists.</li></ul>",
      conservation: "<h2>Conservation Efforts</h2><ul><li>Snow Leopard Trust: This organization works on the ground with local communities to promote conservation efforts, such as sustainable livestock management and eco-tourism.</li><li>Global Snow Leopard Ecosystem Protection Program (GSLEP): This initiative aims to ensure the long-term survival of snow leopards and their habitat through cooperation among the 12 countries where they are found.</li><li>Local Community Engagement: Many conservation programs focus on involving local communities in protection efforts, helping them to understand the ecological importance of snow leopards and providing economic incentives for conservation.</li></ul>",
      "fun-facts": "<h2>Fun Facts</h2><ul><li>Endangered Status: Snow leopards are classified as vulnerable by the International Union for Conservation of Nature (IUCN), with an estimated population of only 4,000 to 6,500 individuals left in the wild due to habitat loss, poaching, and decline of prey species.</li><li>Adaptations for Cold: Snow leopards are well-adapted to their cold mountainous habitats. They have thick fur, large paws that act like snowshoes, and a long tail that helps them maintain balance and can also be wrapped around their bodies for warmth.</li><li>Exceptional Jumpers: Snow leopards can leap up to six times their body length in one bound, which is about 50 feet (15 meters). This helps them navigate the steep, rugged terrains they inhabit.</li><li>Solitary Creatures: Unlike many other big cats, snow leopards are solitary animals. They prefer to live and hunt alone, coming together only for mating.</li><li>Unique Communication: Snow leopards do not roar like other big cats. Instead, they communicate through a range of vocalizations, including growls, hisses, and chuffing sounds, as well as scent markings.</li><li>Cultural Significance: Snow leopards hold significant cultural value in the regions they inhabit, often seen as symbols of strength and resilience. They appear in local folklore and are important for ecotourism.</li></ul>"
  };

  document.getElementById('topic-content').innerHTML = content[topic] || "<p>Topic not found.</p>";
}
